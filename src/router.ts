import { injectable } from "tsyringe";

import {
  Message,
  MessageTypes,
  RuleAddBody,
  RuleIdBody,
} from "./common/interfaces";

@injectable()
class Router {
  async route(
    message: Message,
    callback: (...args: any) => void,
    sendResponse: (response?: any) => void
  ): Promise<void | true> {
    try {
      if (message.type === MessageTypes.GET) {
        const response = await callback();
        sendResponse(response);
      }
      if (message.type === MessageTypes.LIST) {
        const response = await callback();
        sendResponse(response);
      }
      if (message.type === MessageTypes.ADD) {
        let body = message.body as RuleAddBody;
        callback(body.header, body.operation, body.value, body.description);
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
      if (message.type === MessageTypes.EDIT) {
        callback();
        sendResponse({ status: "ok", message: "Rule edit" });
      }
    } catch (e) {
      console.log("Something went wrong", e);
    }
  }
}

export default Router;
