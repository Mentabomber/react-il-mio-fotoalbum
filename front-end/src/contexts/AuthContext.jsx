import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import fetchApi from "../utils/fetchApi";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(
    () => localStorage.getItem("token") ?? null
  );
  const [isLogged, setIsLogged] = useState(false);
  const [initComplete, setInitComplete] = useState(false);
  const navigate = useNavigate();

  /**
   * Dopo che l'utente si è loggato,
   * devo salvare i suoi dati nella variabile user
   *
   * Devo anche salvare il JWT ricevuto dal server
   * @param {{token:string, user: {name:string, surname:string, email:string}}} resp
   */
  function handleLoginOrRegistration(resp) {
    setUser(resp.user);
    setIsLogged(true);

    storeToken(resp.token);
  }

  function handleLogout() {
    setUser(null);
    storeToken(null);

    localStorage.removeItem("token");

    setIsLogged(false);

    // prima finisci di fare quello che stai facendo, come update stati e rendering,
    // dopo esegui la navigazione
    setTimeout(() => {
      navigate("/");
    });
  }

  function storeToken(token) {
    setToken(token);
    localStorage.setItem("token", token);
  }

  /**
   * Recupera l'utente attuale tramite una chiamata API
   */
  async function fetchLoggedUser() {
    const { user } = await fetchApi("/me");
    setUser(user);
    setIsLogged(true);
  }

  async function initializeData() {
    // Se c'è un token memorizzato nel localStorage,
    // lo salvo internamente e lo uso per recuperare l'utente a cui appartiene
    if (token) {
      await fetchLoggedUser();
    }

    console.log("render AuthContext useEffect");

    setInitComplete(true);
  }

  useEffect(() => {
    initializeData();
  }, []);

  console.log("render AuthContext");

  return (
    <AuthContext.Provider
      value={{
        user,
        isLogged,
        initComplete,
        handleLoginOrRegistration,
        handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
