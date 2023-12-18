import { createContext, useContext, useState } from "react";
import fetchApi from "../utils/fetchApi";

// creazione dell context
const PhotosContext = createContext();

// creazione di un elemento custom attorno al provider
export function PhotosProvider({ children }) {
  const [photosList, setPhotosList] = useState([]);

  async function fetchData() {
    const jsonData = await fetchApi("/photos");

    setPhotosList(jsonData.data);
  }

  return (
    <PhotosContext.Provider value={{ photosList, fetchData }}>
      {children}
    </PhotosContext.Provider>
  );
}

// creazione di un custom hook per accedere al context
export function usePhotos() {
  return useContext(PhotosContext);
}
