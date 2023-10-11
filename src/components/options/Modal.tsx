import { useState } from "react";

import { useForm, SubmitHandler } from "react-hook-form";
import { format, formatDistanceToNow } from "date-fns";

import { Dialog } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";

import { Message, MessageTypes } from "../../common/interfaces";
import { getRulesStack } from "./functions";
import { Rule, OpenModal } from "./signals";

interface IFormInput {
  id: number;
  header: String;
  value: String;
  description: String;
}

function Modal() {
  const [edit, setEdit] = useState<boolean>(false);
  const { register, handleSubmit } = useForm<IFormInput>();
  const createdAt = Rule.value?.createdAt
    ? format(new Date(Rule.value?.createdAt), "MM/dd/yyyy hh:mm:ss aa")
    : "";
  const updatedAt = Rule.value?.updatedAt
    ? formatDistanceToNow(new Date(Rule.value?.updatedAt))
    : "";
  const onSubmit: SubmitHandler<IFormInput> = async ({
    id,
    header,
    value,
    description,
  }) => {
    await chrome.runtime.sendMessage<Message, any>({
      type: MessageTypes.EDIT,
      body: {
        id,
        header,
        operation: chrome.declarativeNetRequest.HeaderOperation.SET,
        value,
        description,
      },
    });
    await getRulesStack();
  };
  return (
    <Dialog
      open={OpenModal.value}
      onClose={() => {
        OpenModal.value = false;
        setEdit(false);
      }}
      className="relative z-50"
    >
      {/* The backdrop, rendered as a fixed sibling to the panel container */}
      <div className="fixed inset-0 bg-black/40" aria-hidden="true" />

      {/* Full-screen container to center the panel */}
      <div className="fixed inset-0 flex items-center justify-center py-4">
        {/* The actual dialog panel  */}
        <Dialog.Panel className="mx-auto rounded bg-white p-4 w-1/4">
          <Dialog.Title className="flex items-start justify-between align-middle py-2 border-b rounded-t">
            <h3 className="text-lg font-semibold">Information</h3>
            <button
              type="button"
              className="p-2"
              onClick={() => {
                OpenModal.value = false;
                setEdit(false);
              }}
            >
              <XMarkIcon className="w-5 h-5 text-black" />
            </button>
          </Dialog.Title>
          <Dialog.Description className="flex items-start justify-between align-middle py-2">
            <h4 className="font-thin">
              Description: {Rule.value?.description}
            </h4>
          </Dialog.Description>
          <form
            className="w-full"
            method="POST"
            action="#"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="mb-2">
              <dl>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt>id:</dt>
                  <dd>{Rule.value?.id}</dd>
                  {edit && (
                    <input
                      type="hidden"
                      id="header"
                      placeholder="x-client"
                      className="w-52 bg-gray-200 rounded text-gray-700 focus:outline-none border-b-2 border-gray-300 focus:border-indigo-600 transition duration-500 p-2"
                      {...register("id", { required: true })}
                    />
                  )}
                </div>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt>Name:</dt>
                  {!edit ? (
                    <dd>{Rule.value?.header}</dd>
                  ) : (
                    <dd>
                      <input
                        type="text"
                        id="header"
                        placeholder="x-client"
                        defaultValue={Rule.value?.header}
                        className="w-52 bg-gray-200 rounded text-gray-700 focus:outline-none border-b-2 border-gray-300 focus:border-indigo-600 transition duration-500 p-2"
                        {...register("header", { required: true })}
                      />
                    </dd>
                  )}
                </div>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt>Description:</dt>
                  {!edit ? (
                    <dd>{Rule.value?.description}</dd>
                  ) : (
                    <input
                      type="text"
                      id="description"
                      placeholder="test"
                      defaultValue={Rule.value?.description}
                      className="w-52 bg-gray-200 rounded text-gray-700 focus:outline-none border-b-2 border-gray-300 focus:border-indigo-600 transition duration-500 p-2"
                      {...register("description", { required: true })}
                    />
                  )}
                </div>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt>Type:</dt>
                  <dd>...</dd>
                </div>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt>Value:</dt>
                  <dd>...</dd>
                </div>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt>Status:</dt>
                  <dd>{Rule.value?.enabled ? "On" : "Off"}</dd>
                </div>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt>Created at:</dt>
                  <dd>{createdAt}</dd>
                </div>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt>Last modified:</dt>
                  <dd>{updatedAt}</dd>
                </div>
              </dl>
              <div className="flex justify-center">
                {edit && (
                  <button
                    className="w-14 bg-gradient-to-r from-sky-600 to-purple-600 border-sky-700 hover:ring-2 hover:ring-offset-2 hover:ring-indigo-600 text-white font-bold rounded-lg shadow-lg p-2 transition duration-500 mr-2"
                    type="button"
                  >
                    Edit
                  </button>
                )}
                <button
                  className="min-w-min bg-gradient-to-r from-sky-600 to-purple-600 border-sky-700 hover:ring-2 hover:ring-offset-2 hover:ring-indigo-600 text-white font-bold rounded-lg shadow-lg p-2 transition duration-500"
                  type="button"
                  onClick={() => {
                    setEdit(!edit);
                  }}
                >
                  {!edit ? "Edit header" : "Cancel"}
                </button>
              </div>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}

export default Modal;
