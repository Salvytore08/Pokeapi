import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState, useEffect } from "react";

import "bootstrap/dist/js/bootstrap";
import Cards from './components/cards/cards'

let [pageNumber, setPageNumber] = useState(1);
  let [search, setSearch] = useState("");
  let [status, setStatus] = useState("");
  let [gender, setGender] = useState("");
  let [species, setSpecies] = useState("");

  let [fetchedData, updateFetchedData] = useState([]);
  let { info, results } = fetchedData;

  //console.log(fetchedData)
  let api = `https://pokeapi.co/api/v2/pokemon/${id}`;

  useEffect(() => {
    (async function () {
      let data = await fetch(api).then((res) => res.json());
      updateFetchedData(data);
    })();
  }, [api]);


function App() {
  return (
    <>
      <Cards/>
    </>
  )
}

export default App
