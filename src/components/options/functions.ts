import { Message, MessageTypes } from "../../router";
import { StorageItem } from "../../rules";

import { Rules } from "./signals";

export async function getRulesStack(): Promise<void> {
  try {
    let response = await chrome.runtime.sendMessage<Message, StorageItem[]>({
      type: MessageTypes.LIST,
    });
    Rules.value = response;
  } catch (e) {
    console.log("error");
    console.log(e);
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
