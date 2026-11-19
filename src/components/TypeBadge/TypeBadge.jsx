import PropTypes from "prop-types";
import { TYPES } from "../../utils/types";
import styles from "./TypeBadge.module.scss";

const TypeBadge = ({ type }) => {
  const info = TYPES[type] ?? { label: type, color: "#777" };
  return (
    <span
      className={`${styles.badge} ${info.darkText ? styles.dark : ""}`}
      style={{ backgroundColor: info.color }}
    >
      {info.label}
    </span>
  );
};

TypeBadge.propTypes = { type: PropTypes.string.isRequired };

export default TypeBadge;
