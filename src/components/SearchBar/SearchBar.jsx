import PropTypes from "prop-types";

const SearchBar = ({ value, onChange }) => (
  <div className="input-group">
    <span className="input-group-text bg-white">🔍</span>
    <input
      type="search"
      className="form-control"
      placeholder="Buscar por nombre o número..."
      aria-label="Buscar Pokémon"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
);

SearchBar.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default SearchBar;
