import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

function AlbumPageDetails({ accessToken }) {
  const [albumDetails, setAlbumDetails] = useState(null);
  const { artistID, albumID } = useParams();

  useEffect(() => {
    const fetchAlbumDetails = async () => {
      const searchParameters = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      };
      try {
        const response = await fetch(`https://api.spotify.com/v1/albums/${albumID}`, searchParameters);
        if (response.status === 401) {
          alert("Unauthorized access token. Please refresh the page.");
        } else {
          const data = await response.json();
          setAlbumDetails(data);
        }
      } catch (error) {
        console.error("Error fetching album details:", error);
      }
    };

    fetchAlbumDetails();
  }, [artistID, albumID, accessToken]);

  if (!albumDetails || !albumDetails.artists || albumDetails.artists.length === 0) {
    return <div>Loading...</div>;
  }

  const releaseDate = new Date(albumDetails.release_date);
  const formattedReleaseDate = `${releaseDate.getDate()}/${releaseDate.getMonth() + 1}/${releaseDate.getFullYear()}`;

  return (
    <div>
      <a href={albumDetails.external_urls.spotify} target="_blank" rel="noopener noreferrer">
        <h3 className="text-center text-3xl underline font-medium">
          {albumDetails.artists.map((artist) => artist.name).join(", ")} - {albumDetails.name}
        </h3>
        <div className="flex justify-center">
          <img className="xs:w-64 w-96" src={albumDetails.images[0].url} alt={albumDetails.name} />
        </div>
      </a>
      <p className="text-center text-xl font-medium mb-8">Release Date: {formattedReleaseDate}</p>
      <div className="pb-10">
      <div className="bg-gray-100 rounded-xl p-2 border border-gray-200 mx-10">
        <h4 className="text-lg text-center underline font-medium">Track List ({albumDetails.total_tracks} songs):</h4>
        <ol className="list-decimal">
          {albumDetails.tracks.items.map((track) => (
            <li className="ml-8" key={track.id}>
              <a className="text-blue-600 visited:text-purple-600 underline" href={track.external_urls.spotify} target="_blank" rel="noopener noreferrer">
                {track.name}
              </a>
            </li>
          ))}
        </ol>
      </div>
      </div>
    </div>
  );
}

export default AlbumPageDetails;
