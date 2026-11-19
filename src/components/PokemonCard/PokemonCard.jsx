import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { artworkUrl } from "../../api/pokeapi";
import { TYPES, capitalize, formatId } from "../../utils/types";
import TypeBadge from "../TypeBadge/TypeBadge";
import styles from "./PokemonCard.module.scss";

const PokemonCard = ({ pokemon }) => {
  const { id, name, types } = pokemon;
  const mainColor = TYPES[types[0]]?.color ?? "#ccc";

  return (
    <Link
      to={`/pokemon/${name}`}
      className={styles.card}
      style={{ "--type-color": mainColor }}
    >
      <span className={styles.number}>{formatId(id)}</span>
      <div className={styles.imageWrap}>
        <img src={artworkUrl(id)} alt={name} loading="lazy" className={styles.image} />
      </div>
      <h2 className={styles.name}>{capitalize(name)}</h2>
      <div className={styles.types}>
        {types.map((t) => (
          <TypeBadge key={t} type={t} />
        ))}
      </div>
    </Link>
  );
};

PokemonCard.propTypes = {
  pokemon: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    types: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
};

export default PokemonCard;
