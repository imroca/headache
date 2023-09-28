export type Operation = chrome.declarativeNetRequest.HeaderOperation;
export type ILocalStorage = chrome.storage.LocalStorageArea;
export type Rule = chrome.declarativeNetRequest.Rule;

export interface IItem {
  id: number;
  header: string;
  operation: Operation;
  value: string;
  description?: string;
  enabled?: boolean;
  createdAt?: number;
  updatedAt?: number;
}

export interface IStore {
  get: (id: number) => Promise<IItem>;
  sync: () => void;
  list: () => Promise<IItem[]>;
  add: (
    header: string,
    operation: Operation,
    value: string,
    description: string
  ) => void;
  edit: (
    id: number,
    header: string,
    operation: Operation,
    value: string,
    description: string
  ) => void;
  update: () => void;
  remove: (id: number) => void;
  toggle: (id: number) => void;
  clear: () => void;
  count: () => Promise<number>;
  getNextId: () => Promise<number>;
  getAllIds: () => Promise<number[]>;
}

export const enum MessageTypes {
  GET,
  LIST,
  ENABLED,
  ADD,
  REMOVE,
  CLEAR,
  TOGGLE,
  EDIT,
}

export interface Message {
  type: MessageTypes;
  body?: object;
}

export type RuleIdBody = {
  ruleId: number;
};

export type RuleRemoveBody = {
  ruleId: number;
};

export type RuleAddBody = {
  header: string;
  operation: Operation;
  value: string;
  description: string;
  filter: string;
};

interface Response {
  status: number;
}

export interface SuccessResponse extends Response {
  body?: any;
}

export interface ErrorResponse extends Response {
  message?: any;
}
