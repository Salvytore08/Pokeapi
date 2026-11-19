# Pokédex con React + PokéAPI

Pokédex hecha con **React**, **Vite**, **React Router**, **Bootstrap** y **Sass**, usando los datos de [PokéAPI](https://pokeapi.co).

## Funcionalidades

- Listado de los 1025 Pokémon con imagen oficial, número y tipos.
- Búsqueda por nombre o número (con *debounce*).
- Filtro por tipo (nombres de tipos en español).
- Paginación (24 por página).
- Página de detalle: descripción en español, altura, peso, habilidades y estadísticas base, con navegación al anterior/siguiente.
- Búsqueda, filtro y página se guardan en la URL (se conservan al volver del detalle o al compartir el enlace).
- Caché de peticiones en memoria y cancelación con `AbortController`.

## Estructura

```
src/
├── api/pokeapi.js          # Peticiones a PokéAPI + caché
├── components/             # PokemonCard, TypeBadge, SearchBar, TypeFilter, Pagination, Loader
├── hooks/useDebounce.js
├── pages/                  # Home (listado) y PokemonDetail (detalle)
└── utils/types.js          # Colores y nombres de tipos, helpers
```

## Uso

```bash
npm install
npm run dev      # servidor de desarrollo
npm run build    # build de producción
npm run lint
```
