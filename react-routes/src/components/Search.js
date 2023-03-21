async function search(accessToken, searchInput, setAlbums) {
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
  console.log(data);
  const artist = data.artists.items[0];

  const albumResponse = await fetch(
    `https://api.spotify.com/v1/artists/${artist.id}/albums?include_groups=album&market=US&limit=50`,
    searchParameters
  );
  const albumData = await albumResponse.json();

  const tracks = [];

  for (const album of albumData.items) {
    const tracksResponse = await fetch(
      `https://api.spotify.com/v1/albums/${album.id}/tracks`,
      searchParameters
    );
    const tracksData = await tracksResponse.json();
    tracks.push(tracksData);
  }
  console.log(albumData.items);
  setAlbums(albumData.items);
  return tracks;
}

export default search;
