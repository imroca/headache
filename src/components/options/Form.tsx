import { useForm, SubmitHandler } from "react-hook-form";
import { Message, MessageTypes } from "../../api/interfaces";

interface FormInput {
  header: String;
  value: String;
  description: String;
}

import { getRulesStack } from "./functions";
import { tr } from "date-fns/locale";

function Form() {
  const { register, handleSubmit, reset } = useForm<FormInput>();
  const onSubmit: SubmitHandler<FormInput> = async ({
    header,
    value,
    description,
  }) => {
    console.log("onSubmit", true);

    const response = await chrome.runtime.sendMessage<Message, any>({
      type: MessageTypes.ADD,
      body: {
        header,
        operation: chrome.declarativeNetRequest.HeaderOperation.SET,
        value,
        description,
      },
    });
    console.log("response", response);
    await getRulesStack();
    await reset();
  };
  return (
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
            className="w-52 bg-gray-200 rounded text-gray-700 focus:outline-none border-b-4 border-gray-300 focus:border-indigo-600 transition duration-500 px-3 pb-3"
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
            className="w-52 bg-gray-200 rounded text-gray-700 focus:outline-none border-b-4 border-gray-300 focus:border-indigo-600 transition duration-500 px-3 pb-3"
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
            className="w-52 bg-gray-200 rounded text-gray-700 focus:outline-none border-b-4 border-gray-300 focus:border-indigo-600 transition duration-500 px-3 pb-3"
            {...register("description", { required: true })}
          />
        </div>
        <div>
          <button
            className="w-52 bg-gradient-to-r from-sky-600 to-purple-600 border-sky-700 hover:ring-2 hover:ring-offset-2 hover:ring-indigo-600 text-white font-bold rounded-lg shadow-lg h-[74px] p-2 ml-6 transition duration-500"
            type="submit"
          >
            Add header
          </button>
        </div>
      </div>
    </form>
  );
}

export default Form;
