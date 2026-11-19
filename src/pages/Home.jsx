import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getAllPokemon, getPokemon, getPokemonNamesByType } from "../api/pokeapi";
import Loader from "../components/Loader/Loader";
import Pagination from "../components/Pagination/Pagination";
import PokemonCard from "../components/PokemonCard/PokemonCard";
import SearchBar from "../components/SearchBar/SearchBar";
import TypeFilter from "../components/TypeFilter/TypeFilter";
import useDebounce from "../hooks/useDebounce";

const PAGE_SIZE = 24;

const Home = () => {
  // El estado de los filtros vive en la URL: así se conserva al volver del detalle
  const [params, setParams] = useSearchParams();
  const page = Number(params.get("page")) || 1;
  const type = params.get("type") ?? "";
  const [search, setSearch] = useState(params.get("q") ?? "");
  const debouncedSearch = useDebounce(search.trim().toLowerCase());

  const [allPokemon, setAllPokemon] = useState([]);
  const [typeNames, setTypeNames] = useState(null);
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const updateParams = (changes) => {
    const next = new URLSearchParams(params);
    Object.entries(changes).forEach(([key, value]) => {
      if (value && !(key === "page" && value === 1)) next.set(key, value);
      else next.delete(key);
    });
    setParams(next, { replace: true });
  };

  // Mantener la búsqueda en la URL y volver a la página 1 al cambiarla
  useEffect(() => {
    if (debouncedSearch !== (params.get("q") ?? "")) {
      updateParams({ q: debouncedSearch, page: 1 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  // 1. Lista completa (solo nombres e ids, una sola vez)
  useEffect(() => {
    const controller = new AbortController();
    getAllPokemon(controller.signal)
      .then(setAllPokemon)
      .catch((err) => {
        if (err.name === "AbortError") return;
        setError(err.message);
        setLoading(false);
      });
    return () => controller.abort();
  }, []);

  // 2. Pokémon del tipo seleccionado
  useEffect(() => {
    if (!type) {
      setTypeNames(null);
      return;
    }
    const controller = new AbortController();
    getPokemonNamesByType(type, controller.signal)
      .then(setTypeNames)
      .catch((err) => err.name !== "AbortError" && setError(err.message));
    return () => controller.abort();
  }, [type]);

  // 3. Filtrado en el cliente
  const filtered = useMemo(() => {
    return allPokemon.filter((p) => {
      if (typeNames && !typeNames.has(p.name)) return false;
      if (!debouncedSearch) return true;
      return p.name.includes(debouncedSearch) || String(p.id) === debouncedSearch.replace("#", "");
    });
  }, [allPokemon, typeNames, debouncedSearch]);

  const pageCount = Math.ceil(filtered.length / PAGE_SIZE);
  const pageItems = useMemo(
    () => filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [filtered, page]
  );

  // 4. Detalles (tipos) solo de los Pokémon de la página actual
  useEffect(() => {
    if (!allPokemon.length || (type && !typeNames)) return;
    const controller = new AbortController();
    setLoading(true);
    Promise.all(pageItems.map((p) => getPokemon(p.id, controller.signal)))
      .then((data) => {
        setCards(
          data.map((d) => ({ id: d.id, name: d.name, types: d.types.map((t) => t.type.name) }))
        );
        setError(null);
        setLoading(false);
      })
      .catch((err) => {
        if (err.name === "AbortError") return;
        setError(err.message);
        setLoading(false);
      });
    return () => controller.abort();
  }, [pageItems, allPokemon.length, type, typeNames]);

  const changePage = (newPage) => {
    updateParams({ page: newPage });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <div className="row g-3 mb-4">
        <div className="col-md-8">
          <SearchBar value={search} onChange={setSearch} />
        </div>
        <div className="col-md-4">
          <TypeFilter value={type} onChange={(value) => updateParams({ type: value, page: 1 })} />
        </div>
      </div>

      {error && (
        <div className="alert alert-danger">
          Ocurrió un error al cargar los Pokémon: {error}
        </div>
      )}

      {loading ? (
        <Loader />
      ) : filtered.length === 0 ? (
        <p className="text-center text-muted fs-5 py-5">No se encontró ningún Pokémon 😢</p>
      ) : (
        <>
          <p className="text-muted small">{filtered.length} Pokémon encontrados</p>
          <div className="row row-cols-2 row-cols-sm-3 row-cols-lg-4 row-cols-xl-6 g-3">
            {cards.map((pokemon) => (
              <div className="col" key={pokemon.id}>
                <PokemonCard pokemon={pokemon} />
              </div>
            ))}
          </div>
        </>
      )}

      <Pagination page={page} pageCount={pageCount} onChange={changePage} />
    </>
  );
};

export default Home;
