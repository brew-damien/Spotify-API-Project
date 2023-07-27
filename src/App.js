import React, { useState, useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import ArtistListPage from "./ArtistListPage";
import AlbumListPage from "./AlbumListPage";
import AlbumPageDetails from "./AlbumPageDetails";
import ArtistProfilePage from "./ArtistProfilePage";
import ArtistTracks from "./ArtistTracks";
import TrackPageDetails from "./TrackPageDetails";

const CLIENT_ID = process.env.REACT_APP_CLIENT_ID
console.log(CLIENT_ID)
const CLIENT_SECRET = process.env.REACT_APP_CLIENT_SECRET

function App() {
  const [searchInput, setSearchInput] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [artists, setArtists] = useState([]);
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

  const navigate = useNavigate();

  async function search() {
    const searchParameters = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    };

    const response = await fetch(
      `https://api.spotify.com/v1/search?q=${searchInput}&type=artist&limit=9`,
      searchParameters
    );
    const data = await response.json();

    if (data.artists && data.artists.items && data.artists.items.length > 0) {
      setArtists(data.artists.items);
      navigate("/artist");
    } else {
      alert("Artist not found. Please try another search term.");
    }
  }

  async function selectArtist(artistID) {
    const searchParameters = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    };

    const albumResponse = await fetch(
      `https://api.spotify.com/v1/artists/${artistID}/albums?include_groups=album&market=US&limit=50`,
      searchParameters
    );

    const albumData = await albumResponse.json();
    setAlbums(albumData.items);

    navigate(`/artist/${artistID}`);
  }

  return (
    <div className="bg-black">
      <div className="container mx-auto bg-gray-100 min-h-screen">
        <header>
          <h1 className="font-bold text-center xs:text-4xl xs:pb-2">Spotify Search!</h1>
          <div className="flex justify-center pb-4">
            <div className="mx-2 items-center">
              <input
                className="rounded-l-md border border-black xs:w-48 p-2"
                placeholder="Search artist's name..."
                type="input"
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    search();
                  }
                }}
                onChange={(event) => setSearchInput(event.target.value)}
              />
              <button className="rounded-r-md p-2 border-t border-b border-r border-black m-0" name="button" onClick={search}>
                Search
              </button>
            </div>
          </div>
        </header>
        <Routes>
          <Route path="/artist" element={<ArtistListPage artists={artists} selectArtist={selectArtist} />} />
          <Route path="/artist/:artistID/profile" element={<ArtistProfilePage accessToken={accessToken} />} />
          <Route path="/artist/:artistID/profile/tracks" element={<ArtistTracks accessToken={accessToken} albums={albums} />} />
          <Route path="/artist/:artistID/profile/tracks/:trackID" element={<TrackPageDetails accessToken={accessToken} />} />
          <Route path="/artist/:artistID/profile/albums" element={<AlbumListPage accessToken={accessToken} albums={albums} />} />
          <Route path="/artist/:artistID/profile/albums/:albumID" element={<AlbumPageDetails accessToken={accessToken} />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
