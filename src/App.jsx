import { Link, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import PokemonDetail from "./pages/PokemonDetail";

function App() {
  return (
    <>
      <header className="app-header">
        <div className="container">
          <Link to="/" className="app-title">
            <span className="pokeball" aria-hidden="true" />
            Pokédex
          </Link>
        </div>
      </header>

      <main className="container py-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/pokemon/:name" element={<PokemonDetail />} />
          <Route
            path="*"
            element={
              <div className="text-center py-5">
                <p className="fs-5">Página no encontrada</p>
                <Link to="/" className="btn btn-danger">Volver a la Pokédex</Link>
              </div>
            }
          />
        </Routes>
      </main>

      <footer className="text-center text-muted small py-4">
        Datos de <a href="https://pokeapi.co" target="_blank" rel="noreferrer">PokéAPI</a>
      </footer>
    </>
  );
}

export default App;
