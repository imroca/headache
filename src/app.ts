import { BoltIcon } from "@heroicons/react/24/outline";
import { Message, MessageTypes, route } from "./router";
import { Stack } from "./rules";

export namespace headache.app {
  export function init() {
    console.log("INIT");
    const stack = new Stack();
    // stack.sync();
    chrome.runtime.onMessage.addListener(
      async (
        message: Message,
        _,
        sendResponse
      ): Promise<boolean | undefined> => {
        const handlers = {
          [MessageTypes.GET]: stack.get,
          [MessageTypes.LIST]: stack.list,
          [MessageTypes.RULE]: stack.rule,
          [MessageTypes.ENABLED]: stack.add,
          [MessageTypes.ADD]: stack.add,
          [MessageTypes.REMOVE]: stack.remove,
          [MessageTypes.CLEAR]: stack.clear,
          [MessageTypes.TOGGLE]: stack.toggle,
        };

        console.log("message", JSON.stringify(message));

        await route(message, handlers[message.type], sendResponse);
        return true;
      }
    );
  }
}
