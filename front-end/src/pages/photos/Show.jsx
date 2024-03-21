import { useEffect, useState } from "react";
import {
  useNavigate,
  useNavigation,
  useParams,
  useSearchParams,
} from "react-router-dom";

export default function Show() {
  let initiated = false;
  const { id } = useParams();
  console.log(id);
  // Ottengo uno state con i query string presenti

  const [searchParams, setSearchParams] = useSearchParams();
  const [photo, setPhoto] = useState({});
  const navigation = useNavigate();

  console.log(searchParams);

  async function fetchData() {
    try {
      const url = "http://localhost:3307/photos/";
      const jsonData = await (await fetch(url + id)).json();
      console.log(jsonData, "jsonData");
      if (jsonData === null) {
        navigation("not-found");
      } else {
        setPhoto(jsonData);
      }
    } catch (error) {
      console.log(error);
    }
  }
  function getImgUrl() {
    if (!photo.image) {
      return "/no-image.jpg";
    }

    if (photo.image.startsWith("http") || photo.image.startsWith("data:")) {
      return photo.image;
    }

    return "http://localhost:3307/" + photo.image;
  }

  useEffect(() => {
    if (initiated) {
      return;
    }

    fetchData();

    initiated = true;
  }, []);

  return (
    <div>
      <button onClick={() => navigation(-1)}>Indietro</button>
      <h1>
        Dettagli post #{id} - {photo?.title}
      </h1>
      <span>{photo.description}</span>
      {/* categories */}
      <p className="text-gray-500 text-sm">
        {photo.categories && photo.categories.length
          ? photo.categories.map((category) => (
              <span key={category.id} className="px-2">
                {category.type}
              </span>
            ))
          : "Categorie non disponibili"}
      </p>
      <img src={getImgUrl()} alt="" />
    </div>
  );
}
