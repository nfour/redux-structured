import { Struct } from '../Struct';

export class List extends Struct {
  // TODO: do it
}

import { SelectState } from './utils';

/**
 * @constructor
 *
 * This adds a `add` and `delete` reducer
 * to handle unique, ordered, items in an array.
 *
 * @param {Function} selector - Should return the relevant state
 * @returns @mixin {Object} reducers
 */
export default function List(selectors) {
  const reducers = {
    add(state, { payload: { value, index = 0 } }) {
      if (!state.length) return [value];

      return state.flatMap((item, i) => {
        let flat = [item];
        if (item === value) flat = [];
        if (i === index) flat = [value, ...flat];

        return flat;
      });
    },

    delete(state, { payload: { value } }) {
      return state.filter((item) => item === value);
    },
  };

  return SelectState(selectors, reducers);
}

List.Actions = (base) => {
  return {
    add(value, { index } = {}) {
      return { type: `${base}.add`, payload: { value, index } };
    },
    delete(value) {
      return { type: `${base}.delete`, payload: { value } };
    },
  };
};
