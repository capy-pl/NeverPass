import axios from 'axios';

import { UserSignInRequest, UserSignInResponse } from '../api';

export async function signin(
  body: UserSignInRequest
): Promise<UserSignInResponse> {
  const response = axios.post<UserSignInResponse>();
}
