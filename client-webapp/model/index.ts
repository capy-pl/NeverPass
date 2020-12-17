// api responses a utc date format string, we should manually
// transform it into a javascript date object.
export type DateType = string | Date;

export type DeleteAt = {
  Time: DateType;
  Valid: boolean;
};

export interface GoModel {
  ID: number;
  CreateAt: DateType;
  UpdateAt: DateType;
  DeleteAt: DeleteAt;
}

export interface User {
  id: string;
  account: string;
  pk: string;
}

export interface Type extends GoModel {
  id: number;
  name: string;
  verboseName: string;
  fieldDefinitions: FieldDefinition[];
  default: boolean;
}

export interface FieldDefinition extends GoModel {
  name: string;
  verboseName: string;
  maxlength: number;
  minlength: number;
  encrypted: boolean;
}

export interface ItemField extends GoModel {
  id: number;
  value: string;
  fieldDefinition: FieldDefinition;
}

export interface Item extends GoModel {
  type: Type;
  creatorId: number;
  status: number;
  values: ItemField[];
}
