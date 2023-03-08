export const enum MessageTypes {
  GET,
  LIST,
  RULE,
  ENABLED,
  ADD,
  REMOVE,
  CLEAR,
  TOGGLE,
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
  operation: chrome.declarativeNetRequest.HeaderOperation;
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

export async function route(
  message: Message,
  callback: (...args: any) => void,
  sendResponse: (response?: any) => void
): Promise<void | true> {
  try {
    if (message.type === MessageTypes.GET) {
      const response = await callback();
      sendResponse(response);
    }
    if (message.type === MessageTypes.RULE) {
      let ruleId: number = (message.body as RuleIdBody)?.ruleId;
      const response = await callback(ruleId);
      sendResponse(response);
    }
    if (message.type === MessageTypes.LIST) {
      const response = await callback();
      sendResponse(response);
      return true;
    }
    if (message.type === MessageTypes.ADD) {
      let body = message.body as RuleAddBody;
      callback(body.header, body.operation, body.value);
      sendResponse({ status: "ok", message: "Rule added" });
    }
    if (
      message.type === MessageTypes.REMOVE ||
      message.type === MessageTypes.TOGGLE
    ) {
      let ruleId: number = 0;
      if ((message.body as RuleIdBody)?.ruleId) {
        ruleId = (message.body as RuleIdBody)?.ruleId;
      } else {
        sendResponse({ status: "error", message: "Rule id not found" });
      }
      let response = await callback(ruleId);
      sendResponse(response);
    }
    if (message.type === MessageTypes.CLEAR) {
      callback();
      sendResponse({ status: "ok", message: "Stack clear" });
    }
  } catch (e) {
    console.log("Something went wrong", e);
  }
}

// Down here you can find the Tests...

function sum(a: number, b: number) {
  return a + b;
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;
  describe("#Router", () => {
    it("Sums to numbers", () => {
      expect(sum(1, 1)).toBe(2);
    });
    it("Test the router", () => {});
  });
}
