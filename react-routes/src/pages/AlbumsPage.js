import "../App.css";
import { useState, useEffect } from "react";
import AlbumsCard from "../components/AlbumsCard";
import ArtistName from "../components/ArtistName";
import Header from "../components/Header";

const CLIENT_ID = "8e200c733f8d4bc6a852f81aff924092";
const CLIENT_SECRET = "0e03edbfeb974d4184a98f5a6508c649";

function HomePage(props) {
  const [searchInput, setSearchInput] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [albums, setAlbums] = useState([]);

  useEffect(() => {
    const authParameters = {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `grant_type=client_credentials&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}`,
    };

    fetch("https://accounts.spotify.com/api/token", authParameters)
      .then((result) => result.json())
      .then((data) => setAccessToken(data.access_token));
  }, []);

  return (
    <div className="App">
      <Header
        accessToken={accessToken}
        searchInput={searchInput}
        setAlbums={setAlbums}
        setSearchInput={setSearchInput}
        albums={albums}
      />
      <div className="container">
        <ArtistName />
        <AlbumsCard />
      </div>
    </div>
  );
}

export default HomePage;
