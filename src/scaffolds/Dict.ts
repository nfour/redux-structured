import { Reaction } from "../interfaces";
import { Scaffold } from "../interfaces/Scaffold";
import { IActionSelector, ILayout, IReduxActions } from "../typings";
import { ChainedAction, SelectState } from './utils';

export class Dict extends Scaffold implements Reaction {
  public actions(location: string, children: any) {
    const selector = (key: string) => {
      return children;
    }

    const actions = {
      $merge(payload) {
        return { type: `${location}.$merge`, payload };
      },

      $set(key, value) {
        return { type: `${location}.$set`, payload: { key, value } };
      },

      $delete(key) {
        return { type: `${location}.$delete`, payload: { key } };
      },
    }

    Object.assign(selector, actions);

    return selector;
  }

  public reducers() {
    return {
      $merge(state, { payload }) {
        return state.merge(payload, { deep: true });
      },
      $set(state, { payload: { key, value } }) {
        return state.set(key, value);
      },
      $delete(state, { payload: { key } }) {
        return state.delete(key);
      },
    };
  }
}

/**
 * TODO:
 * - structure.actions should just be a bunch of getters which all populate
 * a new "action state" every time a variable is accessed, ammending to the previously
 * cloned one each depth. If an item is hit that is indeed an endpoint, it is then invoked
 * with that state. Any non-endpoint functions invoked will merely set state at that location
 * based on their ActionSelector fn
 */
