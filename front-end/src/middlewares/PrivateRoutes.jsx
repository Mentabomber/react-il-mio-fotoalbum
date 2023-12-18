import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useEffect } from "react";

export default function PrivateRoutes({ children }) {
  const { isLogged, initComplete } = useAuth();
  const navigate = useNavigate();

  console.log("render PrivateRoutes");

  useEffect(() => {
    // Prima di ritornare i children, controllo se l'utente è loggato
    // e se non lo è, lo reindirizzo alla pagina di login
    if (!isLogged && initComplete) {

      console.log("render PrivateRoutes useEffect");

      // return <Navigate to="/login" />;
      navigate("/login");
    }

  }, [initComplete]);

  return (<>{initComplete && children}</>);
}