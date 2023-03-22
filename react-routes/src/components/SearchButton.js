import search from "./Search";

function SearchButton(props) {
  return (
    <div className="flex">
      <input
        className="input"
        placeholder="Search artist's name..."
        type="input"
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            search(props.accessToken, props.searchInput, props.setAlbums);
          }
        }}
        onChange={(event) => props.setSearchInput(event.target.value)}
      ></input>
      <button
        name="button"
        onClick={function () {
          search(props.accessToken, props.searchInput, props.setAlbums);
        }}
      >
        Search
      </button>
    </div>
  );
}

export default SearchButton;
