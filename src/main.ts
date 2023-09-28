import "reflect-metadata";
import { container } from "tsyringe";
import App from "./app";
import Router from "./router";
import Stack from "./rules";

function load(): void {
  console.log("App Load");
  container.register("App", { useClass: App });
  container.register("Router", { useClass: Router });
  container.register("Stack", { useClass: Stack });
}

export function Headache(): App {
  console.log("App Init");
  load();
  const app = container.resolve<App>("App");
  return app;
}
