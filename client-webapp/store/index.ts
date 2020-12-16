import { configureStore, ReducersMapObject } from '@reduxjs/toolkit';
import {
  globalReducer,
  authReducer,
  userReducer,
  typeReducer,
  GlobalState,
  AuthState,
  UserState,
  TypeState,
  Actions as ApplicationAction,
} from '../core/reducer';

interface ApplicationState {
  global: GlobalState;
  auth: AuthState;
  user: UserState;
  type: TypeState;
}

const reducer: ReducersMapObject<ApplicationState, ApplicationAction> = {
  global: globalReducer,
  auth: authReducer,
  user: userReducer,
  type: typeReducer,
};

const store = configureStore({
  reducer,
});

export default store;
