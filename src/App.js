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
const API_URL = "http://localhost:3001/api/v1/history"; // API endpoint for the search history

function App() {
  const [searchInput, setSearchInput] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [artists, setArtists] = useState([]);
  const [recentlySearchedArtists, setRecentlySearchedArtists] = useState([]); // State to store and display recent search history
  const [albums, setAlbums] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false); //State to show or hide search history

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

  // Use the useEffect hook to fetch recent search history when the component mounts
  useEffect(() => {
    async function fetchRecentSearches() {
      const url = `${API_URL}`;

      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Fetch failed with status ${response.status}`);
        }
        const data = await response.json();
        setRecentlySearchedArtists(data.reverse().slice(0, 5)); // Display the most recent 5 search queries
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

    // Record the search query in the search history
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

    // Update the list of recently searched artists
    setRecentlySearchedArtists(
      (prevSearches) =>
        [{ search_query: searchInput }, ...prevSearches.slice(0, 4)].slice(0, 5) // Keep the most recent 5 search queries
    );
  }

  // Define a function to handle clicking on a recent search item
  function handleHistoryItemClick(searchQuery) {
    setSearchInput(searchQuery);
    search();
  }

  return (
    <div className="bg-black">
      <div className="container mx-auto bg-black min-h-screen">
        <div className="bg-gradient-to-b from-[#1cd760] to-black text-white pt-8 pb-12 w-full text-center">
          <h1 className="font-bold text-4xl xs:text-4xl">Spotify Search!</h1>
        </div>

        {/* Search input and dropdown */}
        <div className="flex flex-col items-center justify-center mt-20">
          <div className="flex justify-center">
            <div className="mx-2 flex items-center relative">
              <div className="relative">
                {/* Input for artist search */}
                <input
                  className={`${
                    showDropdown ? "rounded-tl-md" : "rounded-l-md"
                  } border border-black xs:w-48 p-2 focus:outline-none"`}
                  placeholder="Search artist's name..."
                  type="input"
                  value={searchInput}
                  onChange={(event) => setSearchInput(event.target.value)}
                  onFocus={() => setShowDropdown(true)}
                  onBlur={() => setShowDropdown(false)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      search();
                    }
                  }}
                />
                <button
                  className={`${
                    showDropdown ? "rounded-tr-md" : "rounded-r-md"
                  } bg-gray-100 p-2 border-0 hover:bg-gray-200 focus:outline-none ml-0"`}
                  name="button"
                  onClick={search}
                >
                  Search
                </button>
              </div>
            </div>
          </div>

          {/* Recent search history dropdown */}
          <div
            className={`${
              showDropdown ? "block" : "hidden"
            } flex flex-col bg-white shadow-md rounded-b-md`}
          >
            {recentlySearchedArtists.length > 0 && (
              <div className="mx-2 pl-5 pr-28">
                <p className="text-gray-700 text-sm">Recent Searches:</p>
                <ul className="list-none">
                  {recentlySearchedArtists.map((artist, index) => (
                    <li className="hover:text-gray-500" key={index}>
                      <button
                        className="text-sm hover:underline"
                        onClick={() =>
                          handleHistoryItemClick(artist.search_query)
                        }
                      >
                        {artist.search_query}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        <Routes>
          <Route
            path="/artist"
            element={<ArtistListPage artists={artists} />}
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
