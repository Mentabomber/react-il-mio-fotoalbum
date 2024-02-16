import { useState } from "react";
import { Link, useNavigate, useNavigation } from "react-router-dom";
import { handleInputChange } from "../utils/handleInputChange";
import { useAuth } from "../contexts/AuthContext";
import fetchApi from "../utils/fetchApi";

export default function Register() {
  const navigate = useNavigate();
  const { handleLoginOrRegistration } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    email: "",
    password: "",
  });

  async function onRegistrationSubmit(e) {
    e.preventDefault();

    // chiamata api che invia i dati di login al server e ne riceve la risposta.
    const resp = await fetchApi("/register", "POST", {
      ...formData,
      name: formData.name,
    });

    // salvo i dati nel AuthContext
    handleLoginOrRegistration(resp);

    navigate("/dashboard");
  }

  return (
    <>
      <div className="container mx-auto px-4">
        {/* Form di registrazione con pulsante per tornare alla pagina di login */}
        <div className="flex justify-center items-center h-screen">
          <div className="w-full max-w-md">
            <form
              className="bg-white shadow-lg rounded px-12 pt-6 pb-8 mb-4"
              onSubmit={onRegistrationSubmit}
            >
              {/* Nome */}
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="name"
                >
                  Nome
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none
                focus:shadow-outline"
                  id="name"
                  type="text"
                  placeholder="Nome"
                  value={formData.name}
                  onChange={(e) => handleInputChange(e, "name", setFormData)}
                />
              </div>

              {/* Cognome */}
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="surname"
                >
                  Cognome
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none
                focus:shadow-outline"
                  id="surname"
                  type="text"
                  placeholder="Cognome"
                  value={formData.surname}
                  onChange={(e) => handleInputChange(e, "surname", setFormData)}
                />
              </div>

              {/* Email */}
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="email"
                >
                  Email
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none
                focus:shadow-outline"
                  id="email"
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) => handleInputChange(e, "email", setFormData)}
                />
              </div>

              {/* Password */}
              <div className="mb-6">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="password"
                >
                  Password
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3
                leading-tight focus:outline-none focus:shadow-outline"
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    handleInputChange(e, "password", setFormData)
                  }
                />
                {/* <p className="text-xs italic">Please choose a password.</p> */}
              </div>

              {/* Pulsanti */}
              <div className="flex items-center justify-between">
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded
                focus:outline-none focus:shadow-outline"
                  type="submit"
                >
                  Invia
                </button>
                <Link
                  className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
                  to="/login"
                >
                  Hai già un account?
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
