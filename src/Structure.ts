import { Scaffold } from './scaffolds';
import { IActionsSelection, ILayout, IReducersSelection, IReduxAction } from './typings';
import { getPointer } from "./utils";

export interface IBuildContext { keys: string[]; }

export class Structure {
  public actions: IActionsSelection = {};
  public reducers: IReducersSelection = {};
  public layout: ILayout;

  /** Cache storage for binding arguments to actions */
  private actionBindings: any[] = [];

  constructor(layout: ILayout) {
    this.layout = layout;
  }

  public bindActionsTo(...args: any[]) {
    this.actionBindings = args;
  }

  public build(decendant: null|ILayout, context: IBuildContext = { keys: [] }) {
    if (!decendant) return;

    let layout: ILayout;

    if (decendant instanceof Scaffold) {
      /**
       * Scaffolds
       */

      if (decendant.actions) {
        this.handleActions(decendant, context);
      }

      if (decendant.reducers) {
        this.handleReducers(decendant, context);
      }

      layout = decendant.layout;
    }

    /**
     * Recursion
     */

    if (!layout) layout = decendant;

    Object.keys(layout).forEach((key) => {
      const newContext = { ...context, keys: [...context.keys, key] };

      this.build(
        decendant[key],
        newContext,
      );
    });
  }

  private handleActions(decendant: Scaffold, context: IBuildContext) {
    // ...
    // TODO: put actions into this.actions

    const { actions } = decendant;

    const actionPointer = context.keys.reduce((pointer, key) => {
      if (pointer instanceof Object) return pointer[key];

      return pointer;
    }, this.actions);

    if (!actionPointer) throw new Error(`Action pointer missing for location: ${context.keys}`);

    if (actions instanceof Scaffold) {
      actionPointer
    }
  }

  private handleReducers(decendant: Scaffold, context: IBuildContext) {
    // ...
    // TODO: put reducers into this.reducers
  }
}
