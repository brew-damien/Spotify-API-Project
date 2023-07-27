import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

function ArtistTracks({ accessToken }) {
  const [singles, setSingles] = useState([]);
  const { artistID } = useParams();

  useEffect(() => {
    const fetchArtistAlbums = async () => {
      try {
        const searchParameters = {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        };

        const response = await fetch(
          `https://api.spotify.com/v1/artists/${artistID}/albums?include_groups=single&limit=50`,
          searchParameters
        );

        if (!response.ok) {
          throw new Error("Failed to fetch artist albums. Make sure the artist ID is valid.");
        }

        const data = await response.json();

        const singles = data.items.filter((album) => album.album_type === "single");
        setSingles(singles);
      } catch (error) {
        console.error("Error fetching artist albums:", error);
      }
    };

    if (artistID && accessToken) {
      fetchArtistAlbums();
    }
  }, [artistID, accessToken]);

  return (
    <div>
      <h2 className="text-center underline xs:text-2xl pb-2">Singles:</h2>
      <section className="container mx-auto">
        <ul className="grid xs:grid-cols-1 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
          {singles.map((single) => (
            <li className="xs:w-4/5 xs:mx-auto px-4 xs:mb-8 text-center" key={single.id}>
              <Link to={`/artist/${artistID}/profile/tracks/${single.id}`}>
                {single.images && single.images.length > 0 && (
                  <img className="border border-black" src={single.images[0].url} alt={single.name} />
                )}
                <p>{single.name}</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export default ArtistTracks;
