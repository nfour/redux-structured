import { IReduxActions, IReduxReducers } from "../typings";
import { Action } from "./Action";
import { Reducer } from "./Reducer";
import { Scaffold } from "./Scaffold";

/**
 * **Reactions** serve as both an **Action** and **Reducer**
 * at the location at which they are declared within a **Structure**.
 */
export class Reaction extends Scaffold implements Action, Reducer {
  public actions: IReduxActions;
  public reducers: IReduxReducers;
}
