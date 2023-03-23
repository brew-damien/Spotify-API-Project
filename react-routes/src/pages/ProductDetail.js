import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import "../App.css";
import Tracks from "./Tracks";
import AlbumCard from "../components/AlbumCard";

async function ProductDetailPage(props) {
  const params = useParams();
  //const tracks = useState([]);

  console.log('params', params);

  const tracksResponse = await fetch(
    `https://api.spotify.com/v1/albums/${params.productId}/tracks`,
    searchParameters
  );
  const tracksData = await tracksResponse.json();

  return (
    <div>
      <h1>Stuff and things</h1>
      {/* <AlbumCard />
      <Tracks params={params} /> */}
    </div>
  );
}

export default ProductDetailPage;
