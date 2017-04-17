import { merge, typeOf } from 'lutils';
import { getPointer } from '../utils';

/**
 * @constructor
 *
 * Selects `seamless-immutable` state for reducers
 * from input keys and/or selector functions.
 *
 * @example
 *
 * { stuff: OrderedMap(['boards', (state, action) => action.payload.key, 'stuff']) }
 *
 * @param {Array|Function} selectors
 * @param {Object} reducers
 * @returns {Object}
 */
export function SelectState(selectors, reducers) {
  let reduceKeys = selectors;

  if (typeOf.Array(selectors)) {
    reduceKeys = (state, action) =>
      selectors.map((selector) =>
        (selector instanceof Function ? selector(state, action) : selector),
      );
  }

  const select = (state, action, reducer) => {
    if (reduceKeys) {
      const keys = reduceKeys(state, action);

      keys.forEach((key) => {
        if (!key) throw new Error(`Failed to select reducer key '${key}'`);
      });

      const reducedState = getPointer(state, keys);

      return state.setIn(keys, reducer(reducedState, action));
    }

    return reducer(state, action);
  };

  return Object.keys(reducers).reduce((obj, key) => {
    const reducer = reducers[key];

    obj[key] = (state, action) => select(state, action, reducer);

    return obj;
  }, {});
}

/**
 * @constructor
 *
 * Creates an action which allows for the input of `meta`.
 * `meta` will be added recursively to all `action.meta` after
 * the actions have been called.
 *
 * Reducers will then have a complete `action.meta` object with
 * context, such as for reducer selectors.
 *
 * @example
 *
 * const chained = ChainedAction((meta) => {
 *   return {
 *     test() { return { type: `${meta.foo || 'foo'}.test` } }
 *   }
 * }, {
 *   t() { return { type: "t" } }
 * })
 *
 * chained({ foo: 'bar' }).test() // dispatches { type: "bar.test" }
 * chained.test() // dispatches { type: "foo.test" }
 * chained.t() // dispatches { type: "t" }
 *
 * @returns {Function}
 */
export function ChainedAction(actionsObjectCreator, children = {}) {
  const enhanceActions = (actionCreators, enhance) => {
    return Object.keys(actionCreators).reduce((obj, k) => {
      const actionCreator = actionCreators[k];

      if (typeOf.Function(actionCreator)) {
        const childActions = enhanceActions(actionCreator, enhance);
        obj[k] = enhance(actionCreator);
        merge(obj[k], childActions);
      } else
      if (typeOf.Object(actionCreator)) {
        obj[k] = enhanceActions(actionCreator, enhance);
      } else {
        obj[k] = actionCreator;
      }

      return obj;
    }, {});
  };

  const Factory = (meta = {}) => {
    const enhancement = { meta };

    const actions = { ...actionsObjectCreator(meta), ...children };

    return enhanceActions(actions, (actionCreator) => {
      return (...args) => {
        const action = actionCreator(...args);

        if (typeOf.Function(action)) {
          return (dispatch, ...args2) => {
            const enhancedDispatch = (actionObject) =>
              dispatch(merge(actionObject, enhancement));

            return action(enhancedDispatch, ...args2);
          };
        }

        return merge(action, enhancement);
      };
    });
  };

  const rawActions = actionsObjectCreator({});

  Object.keys(rawActions).forEach((key) => { Factory[key] = rawActions[key]; });
  Object.keys(children).forEach((key) => { Factory[key] = children[key]; });

  return Factory;
}
