import { BoltIcon } from "@heroicons/react/24/outline";
import { Message, MessageTypes } from "./api/interfaces";
import Router from "./router";
import { Stack } from "./rules";
import { container, inject, injectable } from "tsyringe";

@injectable()
class App {
  constructor(
    @inject("Stack") private stack: Stack,
    @inject("Router") private router: Router
  ) {}
  init() {
    chrome.runtime.onMessage.addListener(
      (message: Message, _, sendResponse): boolean | undefined => {
        const handlers = {
          [MessageTypes.GET]: this.stack.get,
          [MessageTypes.LIST]: this.stack.list,
          [MessageTypes.ENABLED]: this.stack.add,
          [MessageTypes.ADD]: this.stack.add,
          [MessageTypes.REMOVE]: this.stack.remove,
          [MessageTypes.CLEAR]: this.stack.clear,
          [MessageTypes.TOGGLE]: this.stack.toggle,
          [MessageTypes.EDIT]: this.stack.edit,
        };

        this.router.route(message, handlers[message.type], sendResponse);
        return true;
      }
    );
  }
}

export default App;
