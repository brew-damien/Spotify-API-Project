import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import "../App.css";
import { Link } from "react-router-dom";

const CLIENT_ID = "8e200c733f8d4bc6a852f81aff924092";
const CLIENT_SECRET = "0e03edbfeb974d4184a98f5a6508c649";

function ProductDetailPage() {
  const params = useParams();
  const [accessToken, setAccessToken] = useState("");
  const [tracks, setTracks] = useState([]);

  useEffect(() => {
    const authParameters = {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `grant_type=client_credentials&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}`,
    };

    fetch("https://accounts.spotify.com/api/token", authParameters)
      .then((result) => result.json())
      .then((data) => setAccessToken(data.access_token))
      .catch((error) => console.error(error));

    const searchParameters = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    };

    async function FetchTrack() {
      const tracksResponse = await fetch(
        `https://api.spotify.com/v1/albums/${params.productId}/tracks`,
        searchParameters
      ).catch((error) => console.error(error));

      if (!tracksResponse.ok) {
        console.error("Error fetching track data:", tracksResponse);
        return;
      }

      const tracksData = await tracksResponse.json();
      console.log("hi", tracksData);
      setTracks(tracksData.items);
    }
    FetchTrack();
  }, []);

  console.log(tracks);

  return (
    <div className="App">
      <h1>Product Details!</h1>
      <a href={`https://open.spotify.com/album/${params.productId}`}>link</a>
      {tracks.map((track, index) => (
        <div key={index}>
          <Link to={`/albums/${params.productId}`}></Link>
          <div>{track.name}</div>
        </div>
      ))}
    </div>
  );
}

export default ProductDetailPage;
