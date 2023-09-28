import { useState, useEffect, useLayoutEffect } from "react";

import {
  createColumnHelper,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  flexRender,
  SortingState,
} from "@tanstack/react-table";

import {
  XCircleIcon,
  PencilSquareIcon,
  BoltIcon,
  BoltSlashIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";

import { toggleRule, removeRule, getRulesStack } from "./functions";

import { IItem } from "../../api/interfaces";
import { Rules, Rule, OpenModal } from "./signals";

function Table() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const columnHelper = createColumnHelper<IItem>();
  const columns = [
    columnHelper.accessor("header", {
      id: "header",
      header: "Name",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("value", {
      id: "value",
      header: "Value",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("description", {
      id: "description",
      header: "Description",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("value", {
      id: "options",
      header: "Options",
      enableSorting: false,
      cell: (info) => {
        return (
          <div className="flex justify-center">
            <div className="cursor-pointer">
              <InformationCircleIcon
                className="h-5 w-5 text-blue-600"
                onClick={async () => {
                  Rule.value = info.row.original;
                  OpenModal.value = true;
                }}
              />
            </div>
            <div
              className="cursor-pointer"
              onClick={() => {
                toggleRule(info.row.original.id);
              }}
            >
              {info.row.original.enabled ? (
                <BoltIcon className="h-5 w-5 text-teal-600" />
              ) : (
                <BoltSlashIcon className="h-5 w-5 text-red-600" />
              )}
            </div>
            <div className="cursor-pointer">
              <PencilSquareIcon className="h-5 w-5 text-indigo-600" />
            </div>
            <div className="cursor-pointer">
              <XCircleIcon
                className="h-5 w-5 text-pink-500 cursor-pointer"
                onClick={() => {
                  removeRule(info.row.original.id);
                }}
              />
            </div>
          </div>
        );
      },
    }),
  ];

  const table = useReactTable({
    data: Rules.value,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    debugTable: true,
  });

  useEffect(() => {
    getRulesStack();
  }, []);

  useLayoutEffect(() => {
    getRulesStack();
  }, []);

  return (
    <table className="table-auto w-full border-gray-900 rounded shadow-md p-4">
      <caption>Rules: {JSON.stringify(Rules.value)}</caption>
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
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
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
  );
}

export default Table;
