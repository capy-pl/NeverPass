import { Type, Item } from '../../model';

export interface UserCreateRequest {
  account: string;
  password: string;
  pk: string;
}

export interface UserCreateResponse {
  id: number;
}

export interface UserSignInRequest {
  account: string;
  password: string;
}

export interface UserSignInResponse {
  token: string;
}

export interface UserInfoResponse {
  id: string;
  pk: string;
  account: string;
}

export type GetTypesResponse = Type[];
export type GetTypeResponse = Type;

export type GetItemsResponse = Item[];
export type GetItemResponse = Item;

export type AddItemRequest = {
  typeid: number;
  fields: { [key: string]: string };
};

export type EditItemRequest = {
  fields: { [key: string]: string };
}

export type AddTypeRequest = {
  name: string;
  fieldDefinitions: string[];
};

export type AddTypeResponse = Type;