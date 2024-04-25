import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import fetchApi from "../utils/fetchApi";

export default function Post({ data }) {
  const [formData, setFormData] = useState({ published: null });

  useEffect(() => {
    if (data) {
      setFormData({
        published: data.published,
      });
    }
  }, [data]);

  async function handleValueChange(id, e) {
    const value = e.target.value;
    console.log(value);
    const checked = e.target.checked;

    let newValue = checked;
    console.log(newValue, "newValue", checked, "checked");
    setFormData({
      published: newValue,
    });
    console.log(formData, "formdata");

    // new method
    const formDataToSend = new FormData();
    console.log(formDataToSend, "tosend");
    formDataToSend.append("published", formData["published"]);

    // old method I used
    // const formDataToSend = new FormData();
    // console.log(formDataToSend, "tosend");
    // Object.keys(formData).forEach((key) => {
    //   formDataToSend.append(key, formData[key]);
    // });
    await fetchApi("/photos/published/" + id, "PUT", formDataToSend);
  }

  function getImgUrl() {
    if (!data.image) {
      return "/no-image.jpg";
    }

    if (data.image.startsWith("http") || data.image.startsWith("data:")) {
      return data.image;
    }

    return "http://localhost:3307/" + data.image;
  }

  return (
    <div className={"w-full h-5 py-10 border-b flex justify-between"}>
      <div className="aspect-square w-1/6 ">
        <img
          src={getImgUrl()}
          alt=""
          className="w-10 h-10 object-cover hover:cursor-pointer hover:scale-[5.0]"
        />
      </div>

      <div className={"flex gap-6 w-3/6 justify-between"}>
        {/* e-mail */}
        <p className="text-md font-semibold mb-4 w-1/4">
          user: {data.user.email}
        </p>
        {/* title */}
        <h2 className="text-md font-semibold mb-4 w-1/4">{data.title}</h2>

        {/* descrizione */}
        <p className="text-md text-gray-500 h-10 w-1/4 overflow-y-auto">
          {data.description ?? "Descrizione non disponibile"}
        </p>

        {/* categories */}
        <p className="text-gray-500 text-sm w-1/4">
          {data.categories.length
            ? data.categories.map((category) => (
                <span key={category.id} className="px-2">
                  {category.type}
                </span>
              ))
            : "Categorie non disponibili"}
        </p>
      </div>
      <div className="flex gap-4 w-2/6 justify-between">
        <Link
          to={"/photos/" + data.id}
          className=" bg-blue-500 hover:bg-blue-800 px-8 py-4 rounded-lg text-white transition-colors flex items-center"
        >
          Visualizza
        </Link>

        <button className=" bg-blue-500 hover:bg-blue-800 px-8 py-4 rounded-lg text-white transition-colors flex items-center">
          Modifica
        </button>
        <div className="mb-4">
          <label className="p-2" htmlFor="available_input">
            Pubblica
          </label>
          <input
            name="published"
            type="checkbox"
            checked={formData.published}
            onChange={(e) => handleValueChange(data.id, e)}
            id="published_input"
          />
        </div>
      </div>
    </div>
  );
}
