import { IReduxReducers } from "../typings";
import { Scaffold } from "./Scaffold";

/**
 * **Reducers** produce redux reducers at their location
 */
export class Reducer extends Scaffold {
  public reducers: IReduxReducers;
}
