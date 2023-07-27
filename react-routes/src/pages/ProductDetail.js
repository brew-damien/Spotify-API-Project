import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import "../App.css";
import Tracks from "./Tracks";
import AlbumCard from "../components/AlbumCard";

function ProductDetailPage(props) {
  const params = useParams();
  const tracks = useState([]);

  console.log(tracks);

  return (
    <div>
      <h1>{params.productId}</h1>
      <AlbumCard />
      <Tracks params={params} />
    </div>
  );
}

export default ProductDetailPage;
