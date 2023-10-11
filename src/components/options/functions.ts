import { IItem, Message, MessageTypes } from "../../common/interfaces";

import { Rules } from "./signals";

export async function getRulesStack(): Promise<void> {
  try {
    let response = await chrome.runtime.sendMessage<Message, IItem[]>({
      type: MessageTypes.LIST,
    });

    if (response !== undefined) {
      Rules.value = response;
    }
  } catch (e) {
    console.log("Error: ", e);
  }
}

export async function toggleRule(ruleId: number): Promise<void> {
  await chrome.runtime.sendMessage<Message, any>({
    type: MessageTypes.TOGGLE,
    body: {
      ruleId,
    },
  });
  getRulesStack();
}

export async function removeRule(ruleId: number): Promise<void> {
  await chrome.runtime.sendMessage<Message, any>({
    type: MessageTypes.REMOVE,
    body: {
      ruleId,
    },
  });
  getRulesStack();
}

export async function clearStack() {
  await chrome.runtime.sendMessage<Message, any>({
    type: MessageTypes.CLEAR,
  });
  await getRulesStack();
}
