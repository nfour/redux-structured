import {
  Action, Reducer, Reaction, Scaffold,
} from './';

export {
  Action, Reducer, Reaction, Scaffold,
}

/**
 * Selector of actions
 *
 * @example
 *
 * actions.items(itemId).bar // actions.items[itemId].foo
 */
export interface IActionSelectors {
  [key: string]: IActionSelectorNode
}

export interface ICallableActionSelector {
  (...args: any[]): IActionSelectorNode
}

export type IActionSelectorNode = ICallableActionSelector|IActionSelectors

export interface ILayoutNesting { [key: string]: ILayout }
export type ILayout = Scaffold | ILayoutNesting;

export type IActionsSelection = IActionSelectorNode | { [key: string]: IActionsSelection }
export type IReducersSelection = Reducer | { [key: string]: Reducer }

export type IReduxReducer = (state: any, action: any) => any
export interface IReduxReducers { [key: string]: IReduxReducer; }

export type IReduxAction = (...args: any[]) => any
export interface IReduxActions { [key: string]: IReduxAction; }
