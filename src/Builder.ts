import { Action, ActionReducer, Reducer } from './blocks';
import { IBlock, IBlocks } from './typings';

export interface IBuildContext { keys: string[]; }

export class Builder {
  private schema: IBlocks;
  // private actions: { [key: string]: Action } = {};
  // private reducers: { [key: string]: Reducer } = {};

  /** Cache storage for binding arguments to actions */
  private actionBindings: any[] = [];

  constructor(schema) {
    this.schema = schema;
    this.build(schema);
  }

  public bindActionsTo(...args: any[]) {
    this.actionBindings = args;
  }

  public build(decendant: IBlocks|IBlock, context?: IBuildContext) {
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
    if (decendant && decendant instanceof Object) {
      /**
       * Go deeper...
       */
      for (const key of Object.keys(decendant)) {
        this.build(decendant[key], { ...context, keys: [...context.keys, key] });
      }
    }
  }

  public buildReducer(decendant: Reducer, context?: IBuildContext) {

  }

  public buildAction(decendant: Action, context?: IBuildContext) {

  }

}
