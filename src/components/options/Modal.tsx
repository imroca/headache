import { Dialog } from "@headlessui/react";
import { Rule, OpenModal } from "./signals";

import { XMarkIcon } from "@heroicons/react/24/outline";

function Modal() {
  return (
    <Dialog
      open={OpenModal.value}
      onClose={() => (OpenModal.value = false)}
      className="relative z-50"
    >
      {/* The backdrop, rendered as a fixed sibling to the panel container */}
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      {/* Full-screen container to center the panel */}
      <div className="fixed inset-0 flex items-center justify-center py-4">
        {/* The actual dialog panel  */}
        <Dialog.Panel className="mx-auto rounded bg-white p-4 w-1/4">
          <Dialog.Title className="flex items-start justify-between align-middle py-2 border-b rounded-t">
            <h3 className="text-lg font-semibold">Information</h3>
            <button
              type="button"
              className=""
              onClick={() => {
                OpenModal.value = false;
              }}
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </Dialog.Title>
          <Dialog.Description className="flex items-start justify-between align-middle py-2">
            <h4 className="font-thin">
              Description: {Rule.value?.description}
            </h4>
          </Dialog.Description>
          <div className="">
            <dl>
              <div>
                <dt>id:</dt>
                <dd>{Rule.value?.rule.id}</dd>
              </div>
              <div>
                <dt>Priority:</dt>
                <dd>{Rule.value?.rule.priority}</dd>
              </div>
              <div>
                <dt>Name:</dt>{" "}
                <dd>{Rule.value?.rule.action.requestHeaders?.at(0)?.header}</dd>
              </div>
              <div>
                <dt>Description:</dt>
                <dd>{Rule.value?.description}</dd>
              </div>
              <div>
                <dt>Type:</dt>
                <dd>
                  {Rule.value?.rule.action.requestHeaders?.at(0)?.operation}
                </dd>
              </div>
              <div>
                <dt>Value:</dt>
                <dd>{Rule.value?.rule.action.requestHeaders?.at(0)?.value}</dd>
              </div>
              <div>
                <dt>Status:</dt>
                <dd>{Rule.value?.enabled}</dd>
              </div>
              <div>
                <dt>Created at:</dt>
                <dd>{Rule.value?.createdAt}</dd>
              </div>
              <div>
                <dt>Last modified:</dt>
                <dd>{Rule.value?.createdAt}</dd>
              </div>
            </dl>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}

export default Modal;
