import SearchButton from "./SearchButton";

function Header(props) {
  return (
    <header>
      <h1>Search Spotify for an artist!</h1>
      <SearchButton
        accessToken={props.accessToken}
        searchInput={props.searchInput}
        setAlbums={props.setAlbums}
        setSearchInput={props.setSearchInput}
        albums={props.albums}
      />
    </header>
  );
}

export default Header;
