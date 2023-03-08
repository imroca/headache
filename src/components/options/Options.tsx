import { useState, useEffect, useReducer, SyntheticEvent } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Message, MessageTypes } from "../../router";
import { StorageItem } from "../../rules";
import "./Options.css";

interface IFormInput {
  header: String;
  value: String;
  description: String;
}

import {
  ArrowPathIcon,
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  TrashIcon,
  XCircleIcon,
  PencilSquareIcon,
  BoltIcon,
  BoltSlashIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";

import {
  createColumnHelper,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  flexRender,
  SortingState,
} from "@tanstack/react-table";

function Options() {
  const { register, handleSubmit, reset } = useForm<IFormInput>();
  const [rules, setRules] = useState<StorageItem[]>([]);

  const [sorting, setSorting] = useState<SortingState>([]);
  const columnHelper = createColumnHelper<StorageItem>();

  const columns = [
    columnHelper.accessor("rule.action.requestHeaders", {
      id: "header",
      header: "Name",
      cell: (info) => info.getValue()?.at(0)?.header,
    }),
    columnHelper.accessor("rule.action.requestHeaders", {
      id: "value",
      header: "Value",
      cell: (info) => info.getValue()?.at(0)?.value,
    }),
    columnHelper.accessor("rule.action.requestHeaders", {
      id: "description",
      header: "Description",
      cell: (info) => info.getValue()?.at(0)?.value,
    }),
    columnHelper.accessor("rule", {
      id: "options",
      header: "Options",
      enableSorting: false,
      cell: (info) => {
        return (
          <div className="flex justify-center">
            <div className="cursor-pointer">
              <InformationCircleIcon
                className="h-5 w-5 text-cyan-600"
                onClick={() => {
                  getRule(info.row.original.rule.id);
                }}
              />
            </div>
            <div
              className="cursor-pointer"
              onClick={() => {
                toggleRule(info.row.original.rule.id);
              }}
            >
              {info.row.original.enabled ? (
                <BoltIcon className="h-5 w-5 text-teal-600" />
              ) : (
                <BoltSlashIcon className="h-5 w-5 text-red-600" />
              )}
            </div>
            <div className="cursor-pointer">
              <PencilSquareIcon className="h-5 w-5 text-purple-600" />
            </div>
            <div className="cursor-pointer">
              <XCircleIcon
                className="h-5 w-5 text-pink-500 cursor-pointer"
                onClick={() => {
                  removeRule(info.row.original.rule.id);
                }}
              />
            </div>
          </div>
        );
      },
    }),
  ];

  const table = useReactTable({
    data: rules,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    debugTable: true,
  });

  async function getRule(ruleId: number) {
    let response = await chrome.runtime.sendMessage<Message, any>({
      type: MessageTypes.RULE,
      body: {
        ruleId,
      },
    });
    console.log(response);
  }

  async function getRulesStack() {
    try {
      let response = await chrome.runtime.sendMessage<Message, StorageItem[]>({
        type: MessageTypes.LIST,
      });
      if (!response) {
        console.error("Error: ", chrome.runtime.lastError?.message);
      }
      if (response) {
        console.log("getRulesStack ->", response);
        setRules(response);
      }
    } catch (e) {
      console.log("error");
      console.log(e);
    }
  }

  async function toggleRule(ruleId: number) {
    await chrome.runtime.sendMessage<Message, any>({
      type: MessageTypes.TOGGLE,
      body: {
        ruleId,
      },
    });
    getRulesStack();
  }

  async function removeRule(ruleId: number) {
    await chrome.runtime.sendMessage<Message, any>({
      type: MessageTypes.REMOVE,
      body: {
        ruleId,
      },
    });
    getRulesStack();
  }

  async function clearStack() {
    await chrome.runtime.sendMessage<Message, any>({
      type: MessageTypes.CLEAR,
    });
    await getRulesStack();
  }

  const onSubmit: SubmitHandler<IFormInput> = async ({
    header,
    value,
    description,
  }) => {
    await chrome.runtime.sendMessage<Message, any>({
      type: MessageTypes.ADD,
      body: {
        header,
        operation: chrome.declarativeNetRequest.HeaderOperation.SET,
        value,
        description,
      },
    });
    await getRulesStack();
    await reset();
  };

  const handleEvent = (e: SyntheticEvent<HTMLDivElement>) => {
    // Do something
    console.log("handleEvent", e);
    getRulesStack();
  };

  useEffect(() => {
    getRulesStack();
  }, []);

  return (
    <div className="body-bg min-h-screen pt-12 md:pt-20 pb-6 px-2 md:px-0">
      <header className="max-w-lg mx-auto">
        <a href="#">
          <h1 className="text-4xl font-bold text-white text-center">
            Welcome to headache
          </h1>
        </a>
      </header>
      <main
        className="bg-white max-w-5xl mx-auto p-8 md:p-12 my-10 rounded shadow-2xl"
        onLoad={handleEvent}
      >
        <section>
          <h3 className="font-bold text-2xl">Add a new header</h3>
        </section>
        <section className="mt-10 max-w-lg">
          <form
            className="w-full"
            method="POST"
            action="#"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="flex flex-row justify-between">
              <div className="mb-6 pt-3 rounded bg-gray-200">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2 ml-3"
                  htmlFor="header"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="header"
                  placeholder="x-client"
                  className="w-52 bg-gray-200 rounded text-gray-700 focus:outline-none border-b-4 border-gray-300 focus:border-purple-600 transition duration-500 px-3 pb-3"
                  {...register("header", { required: true })}
                />
              </div>
              <div className="ml-6 mb-6 pt-3 rounded bg-gray-200">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2 ml-3"
                  htmlFor="value"
                >
                  Value
                </label>
                <input
                  type="text"
                  id="value"
                  placeholder="client-name"
                  className="w-52 bg-gray-200 rounded text-gray-700 focus:outline-none border-b-4 border-gray-300 focus:border-purple-600 transition duration-500 px-3 pb-3"
                  {...register("value", { required: true })}
                />
              </div>
              <div className="ml-6 mb-6 pt-3 rounded bg-gray-200">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2 ml-3"
                  htmlFor="value"
                >
                  Description
                </label>
                <input
                  type="text"
                  id="description"
                  placeholder="add a description..."
                  className="w-52 bg-gray-200 rounded text-gray-700 focus:outline-none border-b-4 border-gray-300 focus:border-purple-600 transition duration-500 px-3 pb-3"
                  {...register("description", { required: true })}
                />
              </div>
              <div>
                <button
                  className="w-52 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg shadow-lg h-[74px] p-2 ml-6 transition duration-500"
                  type="submit"
                >
                  Add header
                </button>
              </div>
            </div>
          </form>
        </section>
        {/* REACT TABLE */}
        <section className="mt-10">
          <h2 className="font-bold text-2xl">Headers</h2>
        </section>
        <section>
          <header className="px-5 py-4">
            <div>
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
            </div>
          </header>
          <table className="table-auto w-full border-gray-900 rounded shadow-md p-4">
            <thead className="text-xs font-semibold uppercase text-gray-400 bg-gray-200">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <th key={header.id} colSpan={header.colSpan}>
                        {header.isPlaceholder ? null : (
                          <div
                            {...{
                              className: header.column.getCanSort()
                                ? "cursor-pointer select-none p-2 whitespace-nowrap"
                                : "p-2 whitespace-nowrap",
                              onClick: header.column.getToggleSortingHandler(),
                            }}
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                            {{
                              asc: " ꜛ",
                              desc: " ꜜ",
                            }[header.column.getIsSorted() as string] ?? null}
                          </div>
                        )}
                      </th>
                    );
                  })}
                </tr>
              ))}
            </thead>
            <tbody className="text-sm divide-y divide-gray-100">
              {(table.getRowModel().rows.length > 0 &&
                table.getRowModel().rows.map((row) => (
                  <tr key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="p-2 whitespace-nowrap">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))) || (
                <tr>
                  <td
                    colSpan={table.getAllColumns().length}
                    className="p-3 text-sm font-bold text-center text-gray-600"
                  >
                    No headers added yet.
                  </td>
                </tr>
              )}
              <tr>
                <td>
                  <input type="text" />
                </td>
                <td>
                  <input type="text" />
                </td>
                <td>
                  <input type="text" />
                </td>
                <td>
                  <input type="text" />
                </td>
              </tr>
            </tbody>
            <tfoot>
              {table.getFooterGroups().map((footerGroup) => (
                <tr key={footerGroup.id}>
                  {footerGroup.headers.map((header) => (
                    <th key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.footer,
                            header.getContext()
                          )}
                    </th>
                  ))}
                </tr>
              ))}
            </tfoot>
          </table>
        </section>
      </main>
    </div>
  );
}

export default Options;
