export interface Rule extends chrome.declarativeNetRequest.Rule {
  enabled?: boolean;
  createdAt?: number;
  updatedAt?: number;
}

export interface StorageItem {
  rule: Rule;
  description?: string;
  enabled?: boolean;
  createdAt?: number;
  updatedAt?: number;
}

// type StorageEntries = StorageItem[];

export interface StackInterface {
  get: () => Promise<Rule[]>;
  sync: () => void;
  list: () => Promise<StorageItem[]>;
  rule: (id: number) => Promise<StorageItem>;
  add: (
    header: string,
    operation: chrome.declarativeNetRequest.HeaderOperation,
    value: string
  ) => void;
  edit: (
    id: number,
    header: string,
    operation: chrome.declarativeNetRequest.HeaderOperation,
    value: string
  ) => void;
  update: () => void;
  remove: (id: number) => void;
  toggle: (id: number) => void;
  clear: () => void;
  count: () => number;
  getNextId: () => number;
  getAllIds: () => Promise<number[]>;
}

export class Stack implements StackInterface {
  private stack: StorageItem[] = [];
  private storage: chrome.storage.LocalStorageArea;

  constructor() {
    this.storage = chrome.storage.local;
  }

  public get = async (): Promise<Rule[]> => {
    const rules = await chrome.declarativeNetRequest.getDynamicRules();
    return rules;
  };

  public list = async (): Promise<StorageItem[]> => {
    this.sync();
    return this.stack;
  };

  public rule = async (id: number): Promise<StorageItem> => {
    const rule = await this.storage.get(id.toString());
    return rule[1];
  };

  public add = async (
    header: string,
    operation: chrome.declarativeNetRequest.HeaderOperation,
    value: string
  ): Promise<void> => {
    const id = this.getNextId();
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
      [id]: {
        rule,
        enabled: true,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
    };

    await this.storage.set(entry);
    await this.sync();
    await this.update();
  };

  // Todo: marks a rule as enabled or disabled.
  public async edit(
    id: number,
    header: string,
    operation: chrome.declarativeNetRequest.HeaderOperation,
    value: string
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
        updatedAt: Date.now(),
      },
    };

    await this.storage.set(entry);
    await this.sync();
  }

  public sync = async (): Promise<void> => {
    const storage = await this.storage.get();
    console.log("🚀 ~ file: rules.ts:129 ~ Stack ~ sync= ~ storage:", storage);
    const entries = Object.entries(storage);
    console.log("🚀 ~ file: rules.ts:131 ~ Stack ~ sync= ~ entries:", entries);
    const rules = entries.map((rule: any) => {
      return rule[1];
    });
    console.log("🚀 ~ file: rules.ts:135 ~ Stack ~ rules ~ rules:", rules);
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
        enabled: !rule[id].enabled,
        updatedAt: Date.now(),
      },
    };

    await this.storage.set(entry);
    await this.sync();
  };

  public remove = async (id: number): Promise<void> => {
    await chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: [id],
    });
    await this.storage.remove(id.toString());
    await this.sync();
  };

  public clear = async () => {
    await this.storage.clear();
    await this.sync();
  };

  public count(): number {
    return this.stack.length;
  }

  public getNextId(): number {
    return this.stack.length === 0 ? 1 : this.stack.length + 1;
  }

  public async getAllIds(): Promise<number[]> {
    const items = await this.list();
    return items.map((item) => item.rule.id);
  }
}
