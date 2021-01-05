import { configureStore, ReducersMapObject } from '@reduxjs/toolkit';
import {
  globalReducer,
  authReducer,
  userReducer,
  GlobalState,
  AuthState,
  UserState,
  Actions as ApplicationAction,
} from '../core/reducer';

interface ApplicationState {
  global: GlobalState;
  auth: AuthState;
  user: UserState;
}

const reducer: ReducersMapObject<ApplicationState, ApplicationAction> = {
  global: globalReducer,
  auth: authReducer,
  user: userReducer,
};

const store = configureStore({
  reducer,
});

export default store;
