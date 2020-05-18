import { Dispatch as ReduxDispatch, Store as ReduxStore, Action } from 'redux';

export type urlStateType = {
  url: string;
};

export type GetUrlState = () => urlStateType;

export type Dispatch = ReduxDispatch<Action<string>>;

export type Store = ReduxStore<any, Action<string>>;
