import PropTypes from "prop-types";
import { TYPES } from "../../utils/types";

const TypeFilter = ({ value, onChange }) => (
  <select
    className="form-select"
    aria-label="Filtrar por tipo"
    value={value}
    onChange={(e) => onChange(e.target.value)}
  >
    <option value="">Todos los tipos</option>
    {Object.entries(TYPES).map(([key, { label }]) => (
      <option key={key} value={key}>
        {label}
      </option>
    ))}
  </select>
);

TypeFilter.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default TypeFilter;
