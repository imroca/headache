import "reflect-metadata";
import { container } from "tsyringe";
import App from "./app";
import Router from "./router";
import { RuleSet, ChromeStore, LocalStore } from "./rules";
import LocalStorage from "./rules";

function load(): void {
  container.register("Router", { useClass: Router });
  container.register("Stack", { useClass: ChromeStore });
  container.register("Store", { useClass: LocalStore });
  container.register("RuleSet", { useClass: RuleSet });
  container.register("App", { useClass: App });
}

export function Headache(): App {
  console.log("Headache");
  load();
  const app = container.resolve<App>("App");
  return app;
}
