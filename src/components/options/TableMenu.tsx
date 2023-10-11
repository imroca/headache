import {
  ArrowPathIcon,
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  TrashIcon,
  AdjustmentsVerticalIcon,
} from "@heroicons/react/24/outline";

import { getRulesStack, clearStack } from "./functions";

function TableMenu() {
  return (
    <div className="flex justify-end gap-2">
      <a
        href="#"
        title="Refresh"
        className="text-sm text-gray-400"
        onClick={async () => {
          await getRulesStack();
        }}
      >
        <ArrowPathIcon className="h-5 w-5 text-gray-600 hover:text-cyan-400" />
      </a>
      <a
        href="#"
        title="Toggle All"
        className="text-sm text-gray-400"
        onClick={() => {
          console.log("Toggle All");
        }}
      >
        <AdjustmentsVerticalIcon className="h-5 w-5 text-gray-600 hover:text-orange-400" />
      </a>
      <a
        href="#"
        title="Upload"
        className="text-sm text-gray-400"
        onClick={() => {
          getRulesStack();
        }}
      >
        <ArrowUpTrayIcon className="h-5 w-5 text-gray-600 hover:text-purple-400" />
      </a>
      <a
        href="#"
        title="Download"
        className="text-sm text-gray-400"
        onClick={() => {
          getRulesStack();
        }}
      >
        <ArrowDownTrayIcon className="h-5 w-5 text-gray-600 hover:text-rose-400" />
      </a>
      <a
        href="#"
        title="Trash"
        className="text-sm text-gray-400"
        onClick={() => {
          clearStack();
        }}
      >
        <TrashIcon className="h-5 w-5 text-gray-600 hover:text-red-400" />
      </a>
    </div>
  );
}

export default TableMenu;
