import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { MAX_POKEMON_ID, artworkUrl, getPokemon, getSpecies } from "../api/pokeapi";
import Loader from "../components/Loader/Loader";
import TypeBadge from "../components/TypeBadge/TypeBadge";
import { STAT_LABELS, TYPES, capitalize, formatId } from "../utils/types";
import styles from "./PokemonDetail.module.scss";

const MAX_STAT = 255;

const getDescription = (species) => {
  const entry =
    species.flavor_text_entries.find((e) => e.language.name === "es") ??
    species.flavor_text_entries.find((e) => e.language.name === "en");
  return entry ? entry.flavor_text.replace(/[\f\n\r]/g, " ") : "";
};

const PokemonDetail = () => {
  const { name } = useParams();
  const navigate = useNavigate();
  const [pokemon, setPokemon] = useState(null);
  const [description, setDescription] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    setPokemon(null);
    setError(null);

    getPokemon(name, controller.signal)
      .then(async (data) => {
        const species = await getSpecies(data.species.name, controller.signal);
        setDescription(getDescription(species));
        setPokemon(data);
      })
      .catch((err) => err.name !== "AbortError" && setError(err.message));

    return () => controller.abort();
  }, [name]);

  if (error) {
    return (
      <div className="text-center py-5">
        <p className="fs-5">No se encontró el Pokémon “{name}”.</p>
        <Link to="/" className="btn btn-danger">
          Volver a la Pokédex
        </Link>
      </div>
    );
  }

  if (!pokemon) return <Loader />;

  const { id, types, stats, abilities, height, weight } = pokemon;
  const mainColor = TYPES[types[0].type.name]?.color ?? "#ccc";
  const total = stats.reduce((sum, s) => sum + s.base_stat, 0);

  return (
    <article className={styles.detail} style={{ "--type-color": mainColor }}>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <button type="button" className="btn btn-outline-secondary" onClick={() => navigate(-1)}>
          ← Volver
        </button>
        <div className="btn-group">
          {id > 1 && (
            <Link to={`/pokemon/${id - 1}`} className="btn btn-outline-secondary">
              ‹ {formatId(id - 1)}
            </Link>
          )}
          {id < MAX_POKEMON_ID && (
            <Link to={`/pokemon/${id + 1}`} className="btn btn-outline-secondary">
              {formatId(id + 1)} ›
            </Link>
          )}
        </div>
      </div>

      <div className={styles.panel}>
        <div className="row g-4 align-items-center">
          <div className="col-md-5 text-center">
            <div className={styles.imageWrap}>
              <img src={artworkUrl(id)} alt={pokemon.name} className={styles.image} />
            </div>
          </div>

          <div className="col-md-7">
            <span className={styles.number}>{formatId(id)}</span>
            <h1 className={styles.name}>{capitalize(pokemon.name)}</h1>
            <div className="d-flex gap-2 mb-3">
              {types.map(({ type }) => (
                <TypeBadge key={type.name} type={type.name} />
              ))}
            </div>
            {description && <p className="text-muted">{description}</p>}

            <div className="row text-center my-3">
              <div className="col">
                <div className={styles.infoValue}>{height / 10} m</div>
                <div className={styles.infoLabel}>Altura</div>
              </div>
              <div className="col">
                <div className={styles.infoValue}>{weight / 10} kg</div>
                <div className={styles.infoLabel}>Peso</div>
              </div>
              <div className="col">
                <div className={styles.infoValue}>
                  {abilities.map((a) => capitalize(a.ability.name)).join(", ")}
                </div>
                <div className={styles.infoLabel}>Habilidades</div>
              </div>
            </div>

            <h2 className="h5 fw-bold mt-4">Estadísticas base</h2>
            {stats.map(({ stat, base_stat }) => (
              <div key={stat.name} className={styles.statRow}>
                <span className={styles.statLabel}>{STAT_LABELS[stat.name] ?? stat.name}</span>
                <span className={styles.statValue}>{base_stat}</span>
                <div className={styles.statBar}>
                  <div style={{ width: `${(base_stat / MAX_STAT) * 100}%` }} />
                </div>
              </div>
            ))}
            <div className={styles.statRow}>
              <span className={`${styles.statLabel} fw-bold`}>Total</span>
              <span className={`${styles.statValue} fw-bold`}>{total}</span>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

export default PokemonDetail;
