import { IActionSelectorNode, ICallableActionSelector, ILayout, IReduxAction, IReduxActions } from "../typings";
import { Scaffold } from "./Scaffold";

/**
 * **Actions** produce `actions` at their location.
 */
export class Action extends Scaffold {
  public static ActionSelector(): IActionSelectorNode {
    const selector: ICallableActionSelector = (...args: any[]) => selector;

    return selector;
  }

  public actions: IReduxAction|IReduxActions;


  constructor(layout?: ILayout)
  constructor(input?: ILayout|IReduxAction) {
    super();

    if (!(input instanceof Function)) {
      throw new Error("Expected parameter 'input' to be Function");
    }

    this.actions = input;

  }
}
