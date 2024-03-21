import { useAuth } from "../contexts/AuthContext";
import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import fetchApi from "../utils/fetchApi";
const initialFormData = {
  title: "",
  description: "",
  published: false,
  image: "",
  categories: [],
};
export default function UpdatePhoto() {
  const { user } = useAuth();
  const navigate = useNavigate();
  let initiated = false;
  const { id } = useParams();
  console.log(id);
  // Ottengo uno state con i query string presenti

  const inputClasses =
    "w-full border-2 border-gray-300 rounded-lg px-4 py-2 transition-colors focus:outline-none focus:border-primary";
  const [formData, setFormData] = useState(initialFormData);
  const [categoriesList, setCategoriesList] = useState([]);
  const [error, setError] = useState("");
  const [validationErrors, setValidationErrors] = useState("");
  const [created, setCreated] = useState(false);
  const [photo, setPhoto] = useState({});

  async function fetchData() {
    try {
      const url = "http://localhost:3307/photos/";
      const jsonData = await (await fetch(url + id)).json();
      console.log(jsonData, "jsonData");
      if (jsonData === null) {
        navigate("not-found");
      } else {
        setFormData({ ...jsonData });
      }
    } catch (error) {
      console.log(error);
    }
  }
  function handleInputChange(e, key) {
    const value = e.target.value;
    const checked = e.target.checked;

    let newValue = e.target.type === "checkbox" ? checked : value;

    if (e.target.type === "file") {
      // prendo il primo file selezionato che è un istanza della classe File.
      newValue = e.target.files[0];
    }
    // controllo se sto assegnando il valore alla proprietà categories
    // se si, devo gestire il valore come se fosse un array
    if (key === "categories") {
      let currentCategories = formData.categories;

      if (checked) {
        currentCategories.push(value);
      } else {
        currentCategories = currentCategories.filter(
          (category) => category !== value
        );
      }

      newValue = currentCategories;
    }
    console.log(newValue, "prima di essere mandata");
    setFormData((prev) => {
      return {
        ...prev,
        [key]: newValue,
      };
    });
  }

  async function fetchCategories() {
    const categories = await (
      await fetch("http://localhost:3307/categories/")
    ).json();

    setCategoriesList(categories);
  }
  function validateForm() {
    let isValid = true;
    const newValidationErrors = {};
    // Title Validation
    if (!formData.title) {
      newValidationErrors.title = "Title is required";
      isValid = false;
    }
    // Description Validation
    if (!formData.description) {
      newValidationErrors.description = "Description is required";
      isValid = false;
    }
    // Image Validation
    if (!formData.image) {
      newValidationErrors.image = "Image is required";
      isValid = false;
    }

    // Category Validation
    if (formData.categories.length === 0) {
      newValidationErrors.category = "At least 1 tag has to be selected";
      isValid = false;
    }

    setValidationErrors(newValidationErrors);
    return isValid;
  }
  async function handleFormSubmit(e) {
    e.preventDefault();
    if (validateForm()) {
      // Form is valid, you can submit or process the data here
      console.log("Form data:", formData);

      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        formDataToSend.append(key, formData[key]);
      });
      console.log(formDataToSend, "mandare");
      await fetchApi("/photos/", "POST", formDataToSend);

      setCreated(true); // Set a submitted flag

      navigate("/photos/" + formDataToSend.id);
    } else {
      // Form is not valid, display error messages
      Error("Errore nell'invio dei dati");
    }
  }

  useEffect(() => {
    fetchCategories();
    if (initiated) {
      return;
    }

    fetchData();

    initiated = true;
  }, []);

  function getImagePreview() {
    console.log("entrato");
    return typeof formData.image !== "string"
      ? URL.createObjectURL(formData.image)
      : "http://localhost:3307/" + formData.image;
  }

  return (
    <>
      <div className="container mx-auto px-4">
        <h1 className="text-3xl">
          Benvenuto {user?.name} {user?.surname}
        </h1>
      </div>
      <div onClick={(e) => e.stopPropagation()}>
        {error && <div className="p-6 text-white bg-red-600">{error}</div>}
        <h1 className="text-2xl mb-12">Aggiungi un nuovo post!</h1>

        <form
          className="mb-8 flex-grow"
          onSubmit={handleFormSubmit}
          id="photoForm"
        >
          <div className="mb-4">
            <label htmlFor="title_input">Titolo</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange(e, "title")}
              id="title_input"
              className={inputClasses}
            />
            {validationErrors.title && (
              <div className="error p-1 text-white bg-red-600 rounded">
                {validationErrors.title}
              </div>
            )}
          </div>
          <div className="mb-4">
            <label htmlFor="description_input">Descrizione</label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => handleInputChange(e, "description")}
              id="description_input"
              className={inputClasses}
            />
            {validationErrors.description && (
              <div className="error p-1 text-white bg-red-600 rounded">
                {validationErrors.description}
              </div>
            )}
          </div>

          <div className="mb-4">
            <label htmlFor="available_input">Pubblica</label>
            <input
              type="checkbox"
              value={formData.published}
              onChange={(e) => handleInputChange(e, "published")}
              id="published_input"
              className={inputClasses}
              checked={formData.published}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="image_input" className="mb-1 block">
              Immagine
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleInputChange(e, "image")}
              id="image_input"
              className={inputClasses}
            />
            {getImagePreview() && (
              <img
                src={getImagePreview()}
                alt=""
                className="w-32 h-32 object-cover"
              />
            )}
            {validationErrors.image && (
              <div className="error p-1 text-white bg-red-600 rounded">
                {validationErrors.image}
              </div>
            )}
          </div>
          <div className="mb-4">
            <label>Tags</label>

            <div className="flex gap-3 flex-wrap">
              {categoriesList.map((category) => {
                return (
                  <label key={category.id}>
                    <input
                      type="checkbox"
                      value={category.id}
                      onChange={(e) => handleInputChange(e, "categories")}
                      id="categories_input"
                      checked={
                        formData.categories.find(
                          (cat) => cat.id === category.id
                        )
                          ? true
                          : false
                      }
                    />

                    <span className="ml-1">{category.type}</span>
                  </label>
                );
              })}
            </div>
            {validationErrors.category && (
              <div className="error p-1 text-white bg-red-600 rounded">
                {validationErrors.category}
              </div>
            )}
          </div>
        </form>

        <div className="flex gap-4">
          <button
            className="w-full bg-gray-200 hover:bg-gray-400 px-8 py-4 rounded-lg text-gray-800 transition-colors"
            form="tagForm"
            type="submit"
            onClick={handleFormSubmit}
          >
            Aggiungi
          </button>
          <button
            className="w-full bg-gray-200 hover:bg-gray-400 px-8 py-4 rounded-lg text-gray-800 transition-colors"
            onClick={() => navigate(-1)}
          >
            Annulla
          </button>
        </div>
      </div>
    </>
  );
}
