import {
  Structure,
  Action, Reducer, ActionReducer,
  Dict, List
} from '../../'


const structure = new Structure({
  items: new Dict(
    new Dict({
      order : new List(),
      count : new Counter(),

      doStuff: new Action(
        ({ incriment, order: { value, index }, item }) =>
          (dispatch) =>
            (action) => {
              const selected = structure.actions.items(action.meta.items.key);

              dispatch(selected.merge(item));
              dispatch(selected.order.set(value, { index }));
              dispatch(selected.incriment(incriment));
            }
      ),
    }),
  ),
});

/**
 * Yields this API:
 */

structure.actions.items(1).doStuff({
  incriment : 2,
  order     : { value: 4, index: 0 },
  item      : { someRandoKey: 'wew' },
});

structure = {
  _actions: {
    items(key) {
      this.__context.key = key;
    }
  },

  get actions() {
    const __context = {}
    return {
      __context,
      ...this._actions
    }
  }
}
