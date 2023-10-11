import { Message, MessageTypes } from "./common/interfaces";
import Router from "./router";
import { RuleSet } from "./rules";
import { inject, injectable } from "tsyringe";

@injectable()
class App {
  constructor(
    @inject("RuleSet") private ruleSet: RuleSet,
    @inject("Router") private router: Router
  ) {}
  init() {
    chrome.runtime.onMessage.addListener(
      (message: Message, _, sendResponse): boolean | undefined => {
        const handlers = {
          [MessageTypes.GET]: this.ruleSet.get,
          [MessageTypes.LIST]: this.ruleSet.list,
          [MessageTypes.ENABLED]: this.ruleSet.add,
          [MessageTypes.ADD]: this.ruleSet.add,
          [MessageTypes.REMOVE]: this.ruleSet.remove,
          [MessageTypes.CLEAR]: this.ruleSet.clear,
          [MessageTypes.TOGGLE]: this.ruleSet.toggle,
          [MessageTypes.EDIT]: this.ruleSet.edit,
        };
        this.router.route(message, handlers[message.type], sendResponse);
        return true;
      }
    );
  }
}

export default App;
