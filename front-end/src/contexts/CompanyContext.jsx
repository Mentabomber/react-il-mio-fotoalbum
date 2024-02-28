import { createContext, useContext, useState } from "react";

const CompanyContext = createContext();

/**
 * Crea un wrapper attorno al provider del context
 */
export function CompanyProvider({ children }) {
  // Creo gli stati o funzioni che voglio rendere disponibili
  const [company, setCompany] = useState({
    name: "Uffici Just Post It",
    address: "Via Roma 1, 20100 Milano",
    claim: "Just Post It!",
  });

  const [contacts, setContacts] = useState({
    phone: "02 12345678",
    email: "info@just_post_it.it",
  });

  const [authMenu, setAuthMenu] = useState([
    {
      label: "Home",
      url: "/",
    },
  ]);

  const [menu, setMenu] = useState([
    {
      label: "Login",
      url: "/login",
    },
    {
      label: "Register",
      url: "/register",
    },
  ]);

  const [logo, setLogo] = useState({
    urlLogoNav: "logo-small-borders.jpg",
    urlLogoFoot: "logo-2.jpg",
    alt: "Logo Just Post It",
  });

  return (
    <CompanyContext.Provider
      value={{ company, contacts, authMenu, menu, logo }}
    >
      {children}
    </CompanyContext.Provider>
  );
}

/**
 * Hook per recuperare il context
 */
export function useCompany() {
  return useContext(CompanyContext);
}
