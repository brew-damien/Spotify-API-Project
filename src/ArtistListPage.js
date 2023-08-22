import React from "react";
import { Link } from "react-router-dom";

function ArtistListPage({ artists }) {
  return (
    <div className="container mx-auto">
      <section className="">
        <div className="mx-auto">
          <ul className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4">
            {artists.map((artist) => (
              <li className="py-2 text-center font-bold" key={artist.id}>
                <Link to={`/artist/${artist.id}/profile`} state={{ artist }}>
                  <img
                    className="xs:w-32 xs:h-32 w-48 h-48 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-60 lg:h-60 xl:w-72 xl:h-72 justify-items-center mx-auto rounded-full"
                    src={artist.images[0]?.url}
                    alt={artist.name}
                  />
                  <p>{artist.name}</p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}

export default ArtistListPage;
