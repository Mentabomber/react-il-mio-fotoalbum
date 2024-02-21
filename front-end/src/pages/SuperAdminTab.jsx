import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function PostsList() {
  let initiated = false;
  const [postsList, setPostsList] = useState([]);

  async function fetchData() {
    const url = "http://localhost:3307/photos/";
    const jsonData = await (await fetch(url)).json();

    setPostsList(jsonData.data);
    console.log(jsonData, "lista", postsList.data, "postsList");
  }
  async function handleEditClick(id) {
    const postData = await (
      await fetch("http://localhost:3307/photos/" + id)
    ).json();

    // apriamo l'overlay
    onEditPost(postData);
  }

  // All'avvio dell'applicazione, fetchiamo i dati
  useEffect(() => {
    if (initiated) {
      return;
    }

    fetchData();

    initiated = true;
  }, []);

  return (
    <>
      <section className="py-8">
        <div className="container px-4 mx-auto">
          <h1 className="text-6xl text-center mb-8">SUPERADMIN TAB</h1>

          {postsList.map((post, index) => (
            <PostSection key={post.id} post={post}></PostSection>
          ))}
        </div>
      </section>
    </>
  );
}

function PostSection({ post, reverse }) {
  function getImgUrl() {
    if (!post.image) {
      return "/no-image.jpg";
    }

    if (post.image.startsWith("http") || post.image.startsWith("data:")) {
      return post.image;
    }

    return "http://localhost:3307/" + post.image;
  }

  return (
    <div className={"w-full h-5 py-10 border-b flex"}>
      <div className="aspect-square w-1/6 ">
        <img
          src={getImgUrl()}
          alt=""
          className="w-10 h-10 object-cover hover:cursor-pointer hover:scale-[5.0]"
        />
      </div>
      <div>user {post.user.email}</div>
      <div className={"flex gap-6 w-5/6 justify-between"}>
        <h2 className="text-4xl font-semibold mb-4 w-2/6">{post.title}</h2>

        {/* descrizione */}
        <p className="text-xl text-gray-500">
          {post.description ?? "Descrizione non disponibile"}
        </p>

        {/* categories */}
        <p className="text-gray-500 text-sm ">
          {post.categories.length
            ? post.categories.map((category) => (
                <span key={category.id} className="px-2">
                  {category.type}
                </span>
              ))
            : "Categorie non disponibili"}
        </p>

        <div className="flex gap-4 align-end">
          <Link
            to={"/photos/" + post.id}
            className="w-full bg-blue-500 hover:bg-blue-800 px-8 py-4 rounded-lg text-white transition-colors flex items-center"
          >
            Visualizza
          </Link>
          <button
            className="w-full bg-blue-500 hover:bg-blue-800 px-8 py-4 rounded-lg text-white transition-colors flex items-center"
            onClick={() => handleEditClick(photo.id)}
          >
            Modifica
          </button>
        </div>
      </div>
    </div>
  );
}
