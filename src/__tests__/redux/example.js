const initialState = {
  multiplier : 2,
  items      : {
    '1': {
      foo    : [],
      foo2   : [{ wew: 'lad' }],
      count  : 0,
      count2 : 0,
    },
  },
};

const {
  Dict, // Immutable Object dictionary data - { set, merge, delete }
  List, // Immutable Array list data - { add, delete }
  Counter, // Count
  Reducer, // Create Reducer at this location
  Action, // Create Action at this location
  Reaction, // Create both Action & Reducer at this location. Action is dumb.
} = Schema;

export const schema = new Schema(
  // Schema
  {
    items: Dict(
      Dict({
        /**
         * @example { type: "items().foo.add", meta: { items: 1 }, payload: 11 }
         * @example schema.items(1).foo.add(11)
         */
        foo: List,

        /**
         * @example { type: "items().foo2().set", meta: { items: 1, foo2: 0 }, payload: { key: 'wew', value: 'lad' } }
         * @example schema.items(1).foo2(0).set('wew', 'lad')
         * @example schema.items(1).foo2(0)('wew').set('lad')
         */
        foo2: List(Dict),

        /**
         * @example { type: "items().count", meta: { items: 1 }, payload: 2 }
         * @example schema.items(1).count(2)
         */
        count: Reducer(
          (state) => (localState, action) => {
            return (localState + action.payload) * state.multiplier;
          },
        ),

        /**
         * @example schema.items(1).count2.incr(2)
         * @example schema.items(1).count2.decr(4)
         */
        count2: {
          incr: Reaction((state) => (localState, action) => {
            return (localState + action.payload) * state.multiplier;
          }),
          decr: Reaction((state) => (localState, action) => {
            return (localState - action.payload) * state.multiplier;
          }),
        },

        /**
         * @example schema.items(1).countTheCount.incr(2)
         * @example schema.items(1).countTheCount.decr(4)
         */
        countTheCount: {
          incr: Reaction((state, action) => {
            return state.setIn(
              ['items', action.meta.key, 'count'],
              state.items[action.meta.key].count + action.payload) * state.multiplier;
          }),
          decr: Reaction((state) => (localState, action) => {
            return state.setIn(
              ['items', action.meta.key, 'count'],
              state.items[action.meta.key].count - action.payload) * state.multiplier;
          }),
        },

        /**
         * @example schema.items(1).countMyShitUp({ incr: 2, decr: 4 })
         */
        countMyShitUp: Action(({ incr, decr }) => (dispatch) => (action) => {
          dispatch(schema.items(action.meta.items).count2.incr(incr));
          dispatch(schema.items(action.meta.items).count2.decr(decr));

          // or

          const count2 = schema.items(action.meta.items).count2;

          dispatch(count2.incr(incr));
          dispatch(count2.decr(decr));
        }),

        newActionIdea: Action((location:string) => {
          return (foo, bar) => {
            return ({ dispatch, getState, action: { meta } }) => {

            }
          }
        }),

      },
    )),

    doStuff: Action(({ key, incr }) => (dispatch) => {
      dispatch(schema.items(key).count(incr));
    }),

    doStuff2: Action(({ key, incr }) => {
      return schema.items(key).count(incr);
    }),
  },
  // (Optional) Initial State (Can be inferred from schema)
  initialState,
);

schema.reducers['items().asdsad.sds'];
schema.actions.items().asdsad.sds.sds();
schema.actions.items().asdsad.sds.sds();
schema.actions.items.$merge();

export const actions = schema.bindDispatchToAction(dispatch);


/**
 * Schema minimal
 */

const schema2 = new Schema({
  items: Dict(
    Dict({
      order : List,
      count : Counter,
    }),
  ),
});

/**
 * Yeilds this API:
 */

schema2.actions.items(1).order.set(2, { index: 4 });
// { type: "items().order.set", meta: { items: { key: 1 } }, payload: { value: 2, index: 4 } }

schema2.actions.items(1).count.incriment(1);
// { type: "items().count.incriment", meta: { items: { key: 1 } }, payload: { incriment: 1 } }


/**
 * Schema minimal 2
 */

const schema3 = new Schema({
  items: Dict(
    Dict({
      order : List,
      count : Counter,

      // Defined at key 'items().myFancyReducer'
      myFancyOperation: Action(({ incriment, order: { value, index }, item }) => (dispatch) => (action) => {
        const selected = schema.actions.items(action.meta.items.key);

        dispatch(selected.merge(item));
        dispatch(selected.order.set(value, { index }));
        dispatch(selected.incriment(incriment));
      }),
    }),
  ),
});

/**
 * Yields this API:
 */

schema3.actions.items(1).myFancyOperation({
  incriment : 2,
  order     : { value: 4, index: 0 },
  item      : { someRandoKey: 'wew' },
});
