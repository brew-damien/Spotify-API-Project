async function search(accessToken, searchInput, artist, album) {
  const searchParameters = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  };

  const response = await fetch(
    `https://api.spotify.com/v1/search?q=${searchInput}&type=artist`,
    searchParameters
  );
  const data = await response.json();
  const artist = data.artists.items[0];
  setArtistName(artist.name);

  const albumResponse = await fetch(
    `https://api.spotify.com/v1/artists/${artist.id}/albums?include_groups=album&market=US&limit=50`,
    searchParameters
  );
  const albumData = await albumResponse.json();
  setAlbums(albumData.items);

  for (const album of albumData.items) {
    const tracksResponse = await fetch(
      `https://api.spotify.com/v1/albums/${album.id}/tracks`,
      searchParameters
    );
    const tracksData = await tracksResponse.json();
    console.log(`Tracks for album '${album.name}':`, tracksData.items);
  }
}

export default search;
