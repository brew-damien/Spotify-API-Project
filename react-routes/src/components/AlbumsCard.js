import { Link } from "react-router-dom";

function AlbumsCard(props) {
  console.log("albums", props.albums);
  if (!props.albums) {
    return null;
  }
  return (
    <div className="card">
      {props.albums.map((album, index) => (
        <div key={album.id}>
          <div>
            <Link to={`/albums/${album.id}`}>
              <img
                className="cover"
                src={album.images[0].url}
                alt="album cover"
              />
            </Link>
          </div>
          <div>{album.name}</div>
        </div>
      ))}
    </div>
  );
}

export default AlbumsCard;
