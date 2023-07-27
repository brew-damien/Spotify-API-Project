import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

function AlbumListPage({ accessToken }) {
  const [albums, setAlbums] = useState([]);
  const { artistID } = useParams();

  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        const searchParameters = {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        };

        const response = await fetch(
          `https://api.spotify.com/v1/artists/${artistID}/albums?include_groups=album&limit=50`,
          searchParameters
        );

        if (!response.ok) {
          throw new Error("Failed to fetch albums. Make sure the artist ID is valid.");
        }

        const data = await response.json();
        setAlbums(data.items);
      } catch (error) {
        console.error("Error fetching albums:", error);
      }
    };

    if (artistID && accessToken) {
      fetchAlbums();
    }
  }, [artistID, accessToken]);

  return (
    <div>
      <h2 className="text-center underline xs:text-2xl pb-2">Albums:</h2>
      <section className="container mx-auto">
        <ul className="grid xs:grid-cols-1 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
          {albums.map((album) => (
            <li className="xs:w-4/5 xs:mx-auto px-4 xs:mb-8 text-center" key={album.id}>
              <Link to={`/artist/${artistID}/profile/albums/${album.id}`}>
                <img className="border border-black" src={album.images[0].url} alt={album.name} />
                <p>{album.name}</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export default AlbumListPage;
