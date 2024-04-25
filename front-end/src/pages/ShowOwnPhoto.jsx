import { useAuth } from "../contexts/AuthContext";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function ShowOwnPhotos() {
  const { user } = useAuth();
  const navigate = useNavigate();
  let initiated = false;
  const [photosList, setPhotosList] = useState([]);
  async function fetchData() {
    console.log(user, "user");
    const url = `http://localhost:3307/photos?userId=${user.id}`;
    const jsonData = await (await fetch(url)).json();

    setPhotosList(jsonData.data);
  }
  function handleEditClick(id) {
    navigate("/update-post/" + id);
  }

  // All'avvio dell'applicazione, fetchiamo i dati
  useEffect(() => {
    if (initiated) {
      return;
    }

    fetchData();

    initiated = true;
  }, [user]);

  return (
    <>
      <section className="py-8">
        <div className="container px-4 mx-auto">
          {photosList.map((photo, index) => (
            <PhotoSection
              key={photo.id}
              photo={photo}
              reverse={index % 2 !== 0}
              handleEditClick={handleEditClick}
            ></PhotoSection>
          ))}
        </div>
      </section>
    </>
  );
}

function PhotoSection({ photo, reverse, handleEditClick }) {
  function getImgUrl() {
    if (!photo.image) {
      return "/no-image.jpg";
    }

    if (photo.image.startsWith("http") || photo.image.startsWith("data:")) {
      return photo.image;
    }

    return "http://localhost:3307/" + photo.image;
  }

  return (
    <div
      className={
        "w-full py-24 border-b flex " + (reverse && "flex-row-reverse")
      }
    >
      <div className="aspect-square w-1/3">
        <img src={getImgUrl()} alt="" className="w-full h-full object-cover" />
      </div>

      <div
        className={
          "flex flex-col gap-6  w-2/3 " +
          (reverse ? "pr-24 text-right" : "pl-24")
        }
      >
        <h2 className="text-4xl font-semibold mb-4">{photo.title}</h2>

        {/* descrizione */}
        <p className="text-xl text-gray-500">
          {photo.description ?? "Descrizione non disponibile"}
        </p>

        {/* categories */}
        <p className="text-gray-500 text-sm ">
          {photo.categories.length
            ? photo.categories.map((category) => (
                <span key={category.id} className="px-2">
                  {category.type}
                </span>
              ))
            : "Categorie non disponibili"}
        </p>

        <div className="flex gap-4">
          <Link
            to={"/photos/" + photo.id}
            className="w-full bg-blue-500 hover:bg-blue-800 px-8 py-4 rounded-lg text-white transition-colors"
          >
            Visualizza
          </Link>
          <button
            className="w-full bg-blue-500 hover:bg-blue-800 px-8 py-4 rounded-lg text-white transition-colors"
            onClick={() => handleEditClick(photo.id)}
          >
            Modifica
          </button>
        </div>
      </div>
    </div>
  );
}
