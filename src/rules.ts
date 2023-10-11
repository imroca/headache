import { injectable, inject } from "tsyringe";

import {
  Operation,
  IItem,
  Rule,
  Rules,
  IStack,
  IRuleSet,
  LocalStorage,
} from "./common/interfaces";

@injectable()
export class ChromeStore implements IStack {
  async get(): Promise<Rule[]> {
    return await chrome.declarativeNetRequest.getDynamicRules();
  }
  async update(removeRuleIds: number[], addRules: Rule[]): Promise<void> {
    await chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds,
      addRules,
    });
  }
}

@injectable()
export class LocalStore implements IStack {
  constructor(@inject("Store") private store: LocalStorage) {}

  async get(): Promise<Rule[]> {
    return (await this.store.get()) as Rule[];
  }
  async update(removeRuleIds: number[], addRules: Rule[]): Promise<void> {
    for (let id of removeRuleIds) {
      await this.store.remove(id.toString());
    }

    for (let rule of addRules) {
      await this.store.set({
        [rule.id.toString()]: rule,
      });
    }
  }
}

@injectable()
export class RuleSet implements IRuleSet {
  constructor(
    @inject("Store") private store: LocalStore,
    @inject("Stack") private stack: ChromeStore
  ) {}

  public get = async (id: number): Promise<void> => {};

  public list = async (): Promise<Rules> => {
    const available = await this.store.get();
    const enabled = await this.stack.get();
    return { available, enabled };
  };

  public add = async (
    header: string,
    operation: Operation,
    value: string,
    description: string
  ): Promise<void> => {
    const id = await this.getNextId();

    let rule: Rule = {
      action: {
        requestHeaders: [
          {
            header,
            operation,
            value,
          },
        ],
        type: chrome.declarativeNetRequest.RuleActionType.MODIFY_HEADERS,
      },
      condition: {
        resourceTypes: [chrome.declarativeNetRequest.ResourceType.MAIN_FRAME],
        urlFilter: "*",
      },
      id,
    };

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
        rule,
      },
    };

    // await this.store.set(entry);
    await this.stack.update([], [rule]);
  };

  // Todo: marks a rule as enabled or disabled.
  public async edit(
    id: number,
    header: string,
    operation: Operation,
    value: string,
    description: string
  ): Promise<void> {
    // let rules = await this.stack.get();
    // let rule = rules.find((rule) => rule.id === id) as Rule;
    // if (!rule) {
    //   throw new Error("Rule not found");
    // }
    // if (!rule.action.requestHeaders) {
    //   throw new Error("Rule not found");
    // }
    // rule.action.requestHeaders[0] = {
    //   header,
    //   operation,
    //   value,
    // };
    // let entry = {
    //   [id]: {
    //     ...rule[id],
    //     description,
    //     updatedAt: Date.now(),
    //   },
    // };
    // await this.store.set(entry);
    // await this.update();
  }

  public sync = async (): Promise<void> => {
    const storage = await this.stack.get();
    const entries = Object.entries(storage);
    const rules = entries.map((rule: any) => {
      return rule[1];
    });
  };

  public async update(): Promise<void> {
    const storage = await this.stack.get();
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
    // let rule = await this.store.get(id.toString());
    // let entry = {
    //   [id]: {
    //     ...rule[id],
    //     description: rule[id].description,
    //     enabled: !rule[id].enabled,
    //     updatedAt: Date.now(),
    //   },
    // };
    // await this.store.set(entry);
  };

  public remove = async (id: number): Promise<void> => {
    // await this.store.remove(id.toString());
    await this.stack.update([id], []);
  };

  public clear = async () => {
    await this.stack.update([], []);
    // await this.store.clear();
    // await this.sync();
  };

  public async count(): Promise<number> {
    const storage = await this.stack.get();
    return Object.keys(storage).length;
  }

  public async getNextId(): Promise<number> {
    const count = await this.count();
    return count === 0 ? 1 : count + 1;
  }

  public async getAllIds(): Promise<number[]> {
    const items = await this.list();
    return items.available.map((item) => item.id);
  }
}

export * from "./common/interfaces";
export default RuleSet;
