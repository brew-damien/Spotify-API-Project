import React from "react";
import { useLocation, Link } from "react-router-dom";

function ArtistProfilePage() {
  const location = useLocation();
  const artist = location.state?.artist;

  if (!artist) {
    return <div>Loading...</div>;
  }

  const getSpotifyProfileURL = () => {
    if (artist.external_urls && artist.external_urls.spotify) {
      return artist.external_urls.spotify;
    }
    return "https://www.spotify.com";
  };

  return (
    <div>
      <div className="text-center">
        <div className="flex justify-center items-center">
          <a
            href={getSpotifyProfileURL()}
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src={artist.images[0]?.url}
              className="xs:w-32 xs:h-32 w-48 h-48 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-60 lg:h-60 xl:w-72 xl:h-72 justify-items-center mx-auto rounded-full"
            />
          </a>
        </div>
        <h3>
          <a
            className="font-semibold text-xl underline"
            href={getSpotifyProfileURL()}
            target="_blank"
            rel="noopener noreferrer"
          >
            {artist.name}
          </a>
        </h3>
        <div>
          <p>Followers: {artist.followers.total}</p>
        </div>
        <div>
          <p>Popularity: {artist.popularity}</p>
        </div>
        <Link to={`/artist/${artist.id}/profile/tracks`}>
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4 mr-2">
            View Tracks
          </button>
        </Link>
        <Link to={`/artist/${artist.id}/profile/albums`}>
          <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-4 ml-2">
            View Albums
          </button>
        </Link>
      </div>
    </div>
  );
}

export default ArtistProfilePage;
