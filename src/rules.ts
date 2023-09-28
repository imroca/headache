import { injectable } from "tsyringe";

import {
  Operation,
  IItem,
  Rule,
  IStore,
  ILocalStorage,
} from "./api/interfaces";
@injectable()
export class Stack implements IStore {
  private stack: IItem[] = [];
  private storage: ILocalStorage;

  constructor() {
    this.storage = chrome.storage.local;
  }

  public get = async (id: number): Promise<IItem> => {
    const item = (await this.storage.get([id])) as IItem;
    return item;
  };

  public list = async (): Promise<IItem[]> => {
    return (await this.storage.get()) as IItem[];
  };

  public add = async (
    header: string,
    operation: Operation,
    value: string,
    description: string
  ): Promise<void> => {
    const id = await this.getNextId();
    console.log(id);
    let entry = {
      [id.toString()]: {
        id,
        header,
        operation,
        value,
        description,
        enabled: true,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
    };

    await this.storage.set(entry);
    // await this.sync();
    // await this.update();
  };

  // Todo: marks a rule as enabled or disabled.
  public async edit(
    id: number,
    header: string,
    operation: Operation,
    value: string,
    description: string
  ): Promise<void> {
    let rule = await this.storage.get(id.toString());
    rule.action.requestHeaders[0] = {
      header,
      operation,
      value,
    };
    let entry = {
      [id]: {
        ...rule[id],
        description,
        updatedAt: Date.now(),
      },
    };

    await this.storage.set(entry);
    await this.sync();
    await this.update();
  }

  public sync = async (): Promise<void> => {
    const storage = await this.storage.get();
    const entries = Object.entries(storage);
    const rules = entries.map((rule: any) => {
      return rule[1];
    });
    this.stack = rules;
  };

  public async update(): Promise<void> {
    const storage = await this.storage.get();
    const entries = Object.entries(storage);
    const enabled = entries.map((entry: any) => {
      if (entry[1].enabled) {
        return entry[1].rule;
      }
    });
    await chrome.declarativeNetRequest.updateDynamicRules({
      addRules: enabled,
      removeRuleIds: enabled.map((item: Rule) => item.id),
    });
  }

  public toggle = async (id: number): Promise<void> => {
    let rule = await this.storage.get(id.toString());
    let entry = {
      [id]: {
        ...rule[id],
        description: rule[id].description,
        enabled: !rule[id].enabled,
        updatedAt: Date.now(),
      },
    };

    await this.storage.set(entry);
    await this.sync();
  };

  public remove = async (id: number): Promise<void> => {
    // await chrome.declarativeNetRequest.updateDynamicRules({
    //   removeRuleIds: [id],
    // });
    await this.storage.remove(id.toString());
    await this.sync();
  };

  public clear = async () => {
    await this.storage.clear();
    await this.sync();
  };

  public async count(): Promise<number> {
    const storage = await this.storage.get();
    return Object.keys(storage).length;
  }

  public async getNextId(): Promise<number> {
    const count = await this.count();
    console.log("count", count);
    return count === 0 ? 1 : count + 1;
  }

  public async getAllIds(): Promise<number[]> {
    const items = await this.list();
    return items.map((item) => item.id);
  }
}

export default Stack;
