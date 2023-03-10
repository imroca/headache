import {
  ArrowPathIcon,
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

import { getRulesStack, clearStack } from "./functions";

function TableMenu() {
  return (
    <div className="flex justify-end">
      <a
        href="#"
        title="Refresh"
        className="text-sm text-gray-400"
        onClick={async () => {
          console.log("hello");
          await getRulesStack();
        }}
      >
        <ArrowPathIcon className="h-5 w-5 text-gray-600" />
      </a>
      <a
        href="#"
        title="Upload"
        className="ml-2 text-sm text-gray-400"
        onClick={() => {
          getRulesStack();
        }}
      >
        <ArrowUpTrayIcon className="h-5 w-5 text-gray-600" />
      </a>
      <a
        href="#"
        title="Download"
        className="ml-2 text-sm text-gray-400"
        onClick={() => {
          getRulesStack();
        }}
      >
        <ArrowDownTrayIcon className="h-5 w-5 text-gray-600" />
      </a>
      <a
        href="#"
        title="Trash"
        className="ml-2 text-sm text-gray-400"
        onClick={() => {
          clearStack();
        }}
      >
        <TrashIcon className="h-5 w-5 text-gray-600" />
      </a>
    </div>
  );
}

export default TableMenu;
