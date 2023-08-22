import React, { useState, useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import ArtistListPage from "./ArtistListPage";
import AlbumListPage from "./AlbumListPage";
import AlbumPageDetails from "./AlbumPageDetails";
import ArtistProfilePage from "./ArtistProfilePage";
import ArtistTracks from "./ArtistTracks";
import TrackPageDetails from "./TrackPageDetails";

const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;
const CLIENT_SECRET = process.env.REACT_APP_CLIENT_SECRET;
const API_URL = "http://localhost:3001/api/v1/history";

function App() {
  const [searchInput, setSearchInput] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [artists, setArtists] = useState([]);
  const [recentlySearchedArtists, setRecentlySearchedArtists] = useState([]);
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

  useEffect(() => {
    async function fetchRecentSearches() {
      const url = `${API_URL}`;

      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Fetch failed with status ${response.status}`);
        }
        const data = await response.json();
        setRecentlySearchedArtists(data);
      } catch (error) {
        console.error("Error fetching recent searches:", error);
      }
    }

    fetchRecentSearches();
  }, []);

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

    // After searching, add the search query and time to the database
    const searchTimestamp = new Date().toISOString();
    const searchQueryData = {
      search_query: searchInput,
      search_timestamp: searchTimestamp,
    };

    const addSearchQueryParameters = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(searchQueryData),
    };

    const addSearchQueryResponse = await fetch(
      API_URL,
      addSearchQueryParameters
    );

    if (!addSearchQueryResponse.ok) {
      console.error("Error adding search query to the database");
    }

    setRecentlySearchedArtists((prevSearches) => [
      { search_query: searchInput },
      ...prevSearches.slice(0, 4),
    ]);
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

  // Render recent searches in your component
  const renderRecentSearches = () => {
    return (
      <div className="mt-2">
        {recentlySearchedArtists.length > 0 && (
          <div className="text-center">
            <p className="text-gray-500 text-sm">Recent Searches:</p>
            <ul className="list-none">
              {recentlySearchedArtists.slice(0, 5).map((artist, index) => (
                <li key={index} className="text-gray-700 text-sm">
                  {artist.search_query}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-black">
      <div className="container mx-auto bg-black min-h-screen">
        <div className="bg-gradient-to-b from-[#1cd760] to-black text-white pt-8 pb-12 w-full text-center">
          <h1 className="font-bold text-4xl xs:text-4xl">Spotify Search!</h1>
        </div>
        <div className="flex flex-col items-center justify-center mt-20">
          <div className="flex justify-center">
            <div className="mx-2 flex items-center">
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
              <button
                className="bg-gray-100 rounded-r-md p-2 border-t border-b border-r border-black"
                name="button"
                onClick={search}
              >
                Search
              </button>
            </div>
          </div>

          {/* Display recent searches */}
          {renderRecentSearches()}
        </div>

        <Routes>
          <Route
            path="/artist"
            element={
              <ArtistListPage artists={artists} selectArtist={selectArtist} />
            }
          />
          <Route
            path="/artist/:artistID/profile"
            element={<ArtistProfilePage accessToken={accessToken} />}
          />
          <Route
            path="/artist/:artistID/profile/tracks"
            element={<ArtistTracks accessToken={accessToken} albums={albums} />}
          />
          <Route
            path="/artist/:artistID/profile/tracks/:trackID"
            element={<TrackPageDetails accessToken={accessToken} />}
          />
          <Route
            path="/artist/:artistID/profile/albums"
            element={
              <AlbumListPage accessToken={accessToken} albums={albums} />
            }
          />
          <Route
            path="/artist/:artistID/profile/albums/:albumID"
            element={<AlbumPageDetails accessToken={accessToken} />}
          />
        </Routes>
      </div>
    </div>
  );
}

export default App;
