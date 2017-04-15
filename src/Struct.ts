// @flow

import { typeOf } from 'lutils';
import Reducer from './Reducer';
import Action from './Action';
import ActionReducer from './ActionReducer';

type Schema = {
  [key: string]: {}|Action|Reducer|ActionReducer
}

export class Nest {
  schema: {}
  actions: {}
  reducers: {}
  actionBindings: []

  constructor(schema: Schema) {
    this.schema = schema;
    this.actions = {};
    this.reducers = {};
    this.actionBindings = [];

    this.build(schema);
  }

  bindActionsTo(...args: any) {
    this.actionBindings = args;
  }

  build(
    decendant: Schema,
    context?: { keys: Array<string> } = { keys: [] },
  ) {
    const isReducer = (
      decendant instanceof ActionReducer ||
      decendant instanceof Reducer
    );

    const isAction = (
      decendant instanceof ActionReducer ||
      decendant instanceof Action
    );

    if (isReducer || isAction) {
      /**
       * Handle...
       */
      if (isReducer) {
        this.buildReducer(decendant, context);
      }

      if (isAction) {
        this.buildAction(decendant, context);
      }
    } else
    if (typeOf.Object(decendant)) {
      /**
       * Go deeper...
       */
      for (const key of Object.keys(decendant)) {
        this.build(decendant[key], { ...context, keys: [...context.keys, key] });
      }
    }
  }

  buildReducer(decendant: Reducer): void {

  }

  buildAction(decendant: Action) {

  }


}
