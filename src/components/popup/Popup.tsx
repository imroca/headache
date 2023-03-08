import { useState } from 'react';
import './Popup.css';

import {
  XCircleIcon,
  PencilSquareIcon,
  BoltIcon,
  BoltSlashIcon,
} from '@heroicons/react/24/outline';
const options = (e: any) => {
  console.log(e);
  chrome.runtime.openOptionsPage();
};

function Popup() {
  return (
    <div className="w-full body-bg min-h-screen pt-12 md:pt-20 pb-6 px-2 md:px-0">
      <header className="max-w-5xl mx-auto">
        <a href="#">
          <h1 className="text-lg font-bold text-white text-center">
            Welcome to headache
          </h1>
        </a>
      </header>
      <main className="bg-white max-w-5xl mx-auto p-8 md:p-12 my-10 rounded shadow-2xl">
        <section>
          <h3 className="font-bold text-md">Header are off</h3>
          <button id="options" onClick={options}>
            Options
          </button>
        </section>
      </main>
    </div>
  );
}

export default Popup;
