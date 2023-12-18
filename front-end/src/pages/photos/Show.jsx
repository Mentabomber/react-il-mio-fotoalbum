import { useEffect, useState } from "react";
import {
  useNavigate,
  useNavigation,
  useParams,
  useSearchParams,
} from "react-router-dom";

export default function Show() {
  const { id } = useParams();

  // Ottengo uno state con i query string presenti
  const [searchParams, setSearchParams] = useSearchParams();
  const [photo, setPhoto] = useState({});
  const navigation = useNavigate();

  console.log(searchParams);

  async function fetchData() {
    setPhoto(await (await fetch("http://localhost:3307/photos/" + id)).json());
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
    fetchData();

    // se non esiste il parametro "nome", reindirizzo l'utente alla homepage
    // if (!searchParams.get("nome")) {
    //   navigation("/");
    // }
  }, []);

  return (
    <div>
      <button onClick={() => navigation(-1)}>Indietro</button>
      <h1>
        Dettagli post #{id} - {photo?.title}
      </h1>
      <p>{photo.description}</p>
      <p className="text-gray-500 text-sm ">
        {photo.categories.length
          ? photo.categories.map((category) => (
              <span className="px-2">{category.type}</span>
            ))
          : "Categorie non disponibili"}
      </p>
      <img src={getImgUrl()} alt="" />
    </div>
  );
}
