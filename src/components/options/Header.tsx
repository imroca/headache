function Header() {
  return (
    <header className="max-w-lg mx-auto flex justify-center align-middle items-center">
      <a href="#">
        <h1 className="text-4xl font-bold text-white text-center">
          Welcome to headache
        </h1>
      </a>
      <img
        src="/images/headache-128.png"
        alt="Headache"
        className="w-16 h-16 rounded-full ml-4"
      />
    </header>
  );
}
export default Header;
