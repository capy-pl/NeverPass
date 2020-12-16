import { Reducer, Action } from '@reduxjs/toolkit';

import { Type } from '../../model';

export interface GlobalState {
  hostname: string;
  protocol: 'http' | 'https';
  port?: number;
}

type GlobalActionType = 'set';

interface GlobalAction extends Action<GlobalActionType> {
  key: string;
  value: string;
}

const initGlobalState: GlobalState = {
  hostname: '127.0.0.1',
  protocol: 'http',
  port: 8080,
};

export interface AuthState {
  token: string;
}

type AuthActionType = 'set';
interface AuthAction extends Action<AuthActionType> {
  key: string;
  value: string;
}

const initAuthState: AuthState = {
  token: '',
};

export interface UserState {
  id: number;
  pk: string;
}

type UserActionType = 'set';
interface UserAction extends Action<UserActionType> {
  key: string;
  value: string;
}

const initUserState: UserState = {
  id: -1,
  pk: '',
};

export type TypeState = Type[];
export type TypeActionType = 'push' | 'remove';

export interface TypeAction extends Action<TypeActionType> {
  value: Type | string;
}

const initTypeState: TypeState = [];

export type ActionType =
  | GlobalActionType
  | AuthActionType
  | UserActionType
  | TypeActionType;

export type Actions = GlobalAction | AuthAction | UserAction | TypeAction;

export const globalReducer: Reducer<GlobalState, GlobalAction> = (
  state: GlobalState = initGlobalState,
  action: GlobalAction
): GlobalState => {
  switch (action.type) {
    case 'set':
      if (action.key in state) {
        return {
          ...state,
          [action.key]: action.value,
        };
      }
      return state;
    default:
      return state;
  }
};

export const authReducer: Reducer<AuthState, AuthAction> = (
  state: AuthState = initAuthState,
  action: AuthAction
): AuthState => {
  switch (action.type) {
    case 'set':
      if (action.key in state) {
        return {
          ...state,
          [action.key]: action.value,
        };
      }
      return state;
    default:
      return state;
  }
};

export const userReducer: Reducer<UserState, UserAction> = (
  state: UserState = initUserState,
  action: UserAction
): UserState => {
  switch (action.type) {
    case 'set':
      if (action.key in state) {
        return {
          ...state,
          [action.key]: action.value,
        };
      }
      return state;
    default:
      return state;
  }
};

export const typeReducer: Reducer<TypeState, TypeAction> = (
  state: TypeState = initTypeState,
  action: TypeAction
): TypeState => {
  return state;
};
