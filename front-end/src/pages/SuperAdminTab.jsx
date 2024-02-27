import { useEffect, useState } from "react";
import PostSection from "../components/PostsList";
import PostsProvider from "../contexts/PhotosContext";

export default function PostsList() {
  let initiated = false;
  const [postsList, setPostsList] = useState([]);

  async function fetchData() {
    const url = "http://localhost:3307/photos/";
    const jsonData = await (await fetch(url)).json();

    setPostsList(jsonData.data);
    console.log(jsonData, "lista", postsList.data, "postsList");
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
      <PostsProvider>
        <section className="py-8">
          <div className="container px-4 mx-auto">
            <h1 className="text-6xl text-center mb-8">SUPERADMIN TAB</h1>

            {postsList.map((post) => (
              <PostSection key={post.id} data={post}></PostSection>
            ))}
          </div>
        </section>
      </PostsProvider>
    </>
  );
}
