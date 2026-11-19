const BASE_URL = "https://pokeapi.co/api/v2";

// Solo especies "base" (sin formas alternativas como megas o gigamax)
export const MAX_POKEMON_ID = 1025;

const cache = new Map();

async function getJSON(url, signal) {
  if (cache.has(url)) return cache.get(url);
  const res = await fetch(url, { signal });
  if (!res.ok) {
    throw new Error(res.status === 404 ? "No encontrado" : `Error ${res.status}`);
  }
  const data = await res.json();
  cache.set(url, data);
  return data;
}

export const idFromUrl = (url) => Number(url.split("/").filter(Boolean).pop());

export const artworkUrl = (id) =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;

/** Lista ligera de todos los Pokémon: [{ id, name }] */
export async function getAllPokemon(signal) {
  const data = await getJSON(`${BASE_URL}/pokemon?limit=${MAX_POKEMON_ID}`, signal);
  return data.results.map((p) => ({ id: idFromUrl(p.url), name: p.name }));
}

/** Nombres de los Pokémon que tienen un tipo dado */
export async function getPokemonNamesByType(type, signal) {
  const data = await getJSON(`${BASE_URL}/type/${type}`, signal);
  return new Set(
    data.pokemon
      .filter(({ pokemon }) => idFromUrl(pokemon.url) <= MAX_POKEMON_ID)
      .map(({ pokemon }) => pokemon.name)
  );
}

export function getPokemon(idOrName, signal) {
  return getJSON(`${BASE_URL}/pokemon/${String(idOrName).toLowerCase()}`, signal);
}

export function getSpecies(idOrName, signal) {
  return getJSON(`${BASE_URL}/pokemon-species/${idOrName}`, signal);
}
