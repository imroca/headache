import Form from "./Form";
import Table from "./Table";
import TableMenu from "./TableMenu";
import Modal from "./Modal";

function Options() {
  return (
    <div className="bg-gradient-to-br from-sky-600 to-purple-600 min-h-screen pt-12 md:pt-20 pb-6 px-2 md:px-0">
      <header className="max-w-lg mx-auto">
        <a href="#">
          <h1 className="text-4xl font-bold text-white text-center">
            Welcome to headache
          </h1>
        </a>
      </header>
      <main className="bg-white max-w-5xl mx-auto p-8 md:p-12 my-10 rounded shadow-2xl">
        <section>
          <h3 className="font-bold text-2xl">Add a new header</h3>
        </section>
        <section className="mt-10 max-w-lg">
          <Form />
        </section>
        <section className="mt-10">
          <h2 className="font-bold text-2xl">Headers</h2>
        </section>
        <section>
          <header className="px-5 py-4">
            <TableMenu />
          </header>
          <Table />
        </section>
        <Modal />
      </main>
    </div>
  );
}

export default Options;
