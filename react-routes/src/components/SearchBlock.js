import search from "./Search";

import { useState } from "react";

function SearchBlock(props) {

  const [searchInput, setSearchInput] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    let albums = await search(props.accessToken, searchInput);
    props.callback(albums)
  }

  return (
    <div className="flex">
      <form onSubmit={handleSubmit}>
        <input
          className="input"
          placeholder="Search artist's name..."
          type="input"
          onChange={(event) => setSearchInput(event.target.value)}
        ></input>
        <button name="button">
          Search
        </button>
      </form>
    </div>
  );
}

export default SearchBlock;
