import { Action } from "../interfaces/Action";
import { Scaffold } from "../interfaces/Scaffold";
import { IActionSelector, ILayout, IReduxActions } from "../typings";
import { ChainedAction, SelectState } from './utils';

export class Dict extends Scaffold implements Action {
  public static ActionSelector(): IActionSelector {

  }

  public actions: IReduxActions;


  constructor(input?: ILayout) {
    super();
  }

}


export function DictFn(selectors) {
  const reducers = {
    merge(state, { payload }) {
      return state.merge(payload, { deep: true });
    },
    set(state, { payload: { key, value } }) {
      return state.set(key, value);
    },
    delete(state, { payload: { key } }) {
      return state.delete(key);
    },
  };

  return SelectState(selectors, reducers);
}

Dict.Actions = (base, children) => {
  return ChainedAction(({ key: baseKey }) => {
    const actions = {
      merge(payload) {
        return { type: `${base}.merge`, payload };
      },

      set(...args) {
        let key = baseKey;
        let [value] = args;

        if (args.length === 2) [key, value] = args;

        return { type: `${base}.set`, payload: { key, value } };
      },

      delete(key = baseKey) {
        return { type: `${base}.delete`, payload: { key } };
      },
    };

    return actions;
  }, children);
};
