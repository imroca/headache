import { Message, MessageTypes, route } from "./src/router";
import { Stack } from "./src/rules";

const stack = new Stack();
// stack.sync();
chrome.runtime.onMessage.addListener((message: Message, _, sendResponse) => {
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
  console.log("background", JSON.stringify(message));
  route(message, handlers[message.type], sendResponse);
  return true;
});
