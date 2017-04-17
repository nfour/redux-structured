import { ILayout, IReduxAction, IReduxActions, IReduxReducers } from "../typings";

/**
 * **Scaffolds** defines a type for which **Structures** are built from.
 */
export class Scaffold {
  public layout?: ILayout;
  public actions?: IReduxAction|IReduxActions;
  public reducers?: IReduxReducers;
}
