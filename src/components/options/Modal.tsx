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
      <div className="fixed inset-0 flex items-center justify-center p-4">
        {/* The actual dialog panel  */}
        <Dialog.Panel className="mx-auto rounded bg-white p-4 w-1/4">
          <Dialog.Title className="flex items-start justify-between align-middle p-4 border-b rounded-t">
            <h3 className="text-lg font-semibold">
              {Rule.value?.rule.action.requestHeaders?.at(0)?.header}
            </h3>
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
          <div>{Rule.value?.rule.action.requestHeaders?.at(0)?.value}</div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}

export default Modal;
