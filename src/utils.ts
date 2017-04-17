import { typeOf } from 'lutils';
import Immutable from 'seamless-immutable';

/**
 * Flattens [ { id: 1 } ] into { "1": { id: 1 } }
 *
 * @param {Array} rowsArray
 * @return {Object} { rows: { "1": { id: 1 } }, order: ["1"] }
 */
export function flattenArray(rowsArray, ...primaryKeys) {
  const rows = {};
  const order = [];

  const primaryKey = primaryKeys.find((key) => key in rowsArray[0]) || 'id';

  rowsArray.forEach((row) => {
    const rowKey = row[primaryKey];

    if (!rowKey) return;

    order.push(rowKey);
    rows[rowKey] = row;
  });

  return { rows, order };
}

export function flattenObject(input) {
  return Object.keys(input).reduce((parent, key) => {
    const val = input[key];

    if (typeOf.Object(val)) {
      const children = flattenObject(val);
      Object.keys(children).forEach((childKey) => {
        parent[`${key}.${childKey}`] = children[childKey];
      });
    } else {
      parent[key] = val;
    }

    return parent;
  }, {});
}

/**
 * Reduces down traversable objects by keys
 */
export function getPointer(
  target: { [key: string]: any },
  keys: string[],
) {
  return keys.reduce((pointer, key) => {
    if (pointer instanceof Object) return pointer[key];

    return undefined;
  }, target);
}


/**
 * @constructor
 *
 * - Lets reducers hide in a nested object.
 * - Converts initialState to `seamless-immutable`.
 * - Flattens object keys to `.` separated paths.
 *
 * @example
 *
 * { Some: { reducer() {} } }
 *
 * // becomes
 *
 * { 'Some.reducer': function() {} }
 *
 * // Which matches the action { type: "Some.reducer" }
 *
 * @returns {Function} reducer
 */
export default function NestedReducer(nested, initialState) {
  const reducers = flattenObject(nested);
  initialState = Immutable(initialState);

  return (state = initialState, action) => {
    const reducer = reducers[action.type];

    action.meta = action.meta || {};

    if (reducer) return reducer(state, action);

    return state;
  };
}
