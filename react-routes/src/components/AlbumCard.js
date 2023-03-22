function AlbumCard(props) {
  return (
    <img
      src="album-card"
      href={`https://open.spotify.com/album/${props.productId}`}
    />
  );
}

export default AlbumCard;
