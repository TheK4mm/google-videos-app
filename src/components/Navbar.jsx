import SearchBar from "./SearchBar";

function Navbar({ onSearch }) {
  return (
    <nav className="navbar">
      <h2>VideoApp</h2>
      <SearchBar onSearch={onSearch} />
    </nav>
  );
}

export default Navbar;