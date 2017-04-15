import { Action, Reducer, ActionReducer } from './';

/** TODO: fill me out */
export type IBlock = Action | Reducer | ActionReducer;

/** TODO: fill me out */
export interface IBlocks { [key: string]: IBlock; }
