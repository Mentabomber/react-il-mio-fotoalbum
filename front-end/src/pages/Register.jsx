import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { handleInputChange } from "../utils/handleInputChange";
import { useAuth } from "../contexts/AuthContext";
import fetchApi from "../utils/fetchApi";
import { useCompany } from "../contexts/CompanyContext";
import FormInput from "../components/inputs/Input";

export default function Register() {
  const navigate = useNavigate();
  const { logo } = useCompany();
  const { handleLoginOrRegistration } = useAuth();
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    email: "",
    password: "",
  });
  const [passwordMatching, setPasswordMatching] = useState({ password: "" });
  function validateForm() {
    let isValid = true;
    const newErrors = {};

    // Validate name
    if (!formData.name) {
      newErrors.name = "Name is required";
      isValid = false;
    } else if (formData.name.length < 3) {
      newErrors.name = "Name must be 3 characters long or higher";
      isValid = false;
    }
    // Validate surname
    if (!formData.surname) {
      newErrors.surname = "Surname is required";
      isValid = false;
    } else if (formData.surname.length < 3) {
      newErrors.surname = "Surname must be 3 characters long or higher";
      isValid = false;
    }
    // Validate email
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    const isValidEmail = emailRegex.test(formData.email);
    if (!formData.email) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!isValidEmail) {
      newErrors.email = "Email is not valid";
      isValid = false;
    }
    // Validate password
    // Has minimum 8 characters in length. Adjust it by modifying {8,}
    // At least one uppercase English letter. You can remove this condition by removing (?=.*?[A-Z])
    // At least one lowercase English letter.  You can remove this condition by removing (?=.*?[a-z])
    // At least one digit. You can remove this condition by removing (?=.*?[0-9])
    // At least one special character,  You can remove this condition by removing (?=.*?[#?!@$%^&*-])
    const passwordRegex =
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
    const isValidPassword = passwordRegex.test(formData.password);
    if (!formData.password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (!isValidPassword) {
      newErrors.password =
        "Password must be minimum 8 characters, have at least one uppercase and lowercase letter, one number and a special character";
      isValid = false;
    }
    ("");
    // Validate repeat password
    console.log(formData.password, "pswd", passwordMatching.password, "repeat");
    if (formData.password !== passwordMatching.password) {
      newErrors.passwordMatching = "Password doesn't match";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  }
  async function onRegistrationSubmit(e) {
    e.preventDefault();
    if (validateForm()) {
      // Form is valid, you can submit or process the data here
      console.log("Form data:", formData);
      // chiamata api che invia i dati di login al server e ne riceve la risposta.
      const resp = await fetchApi("/register", "POST", {
        ...formData,
        name: formData.name,
      });
      console.log(resp, "resp");
      setSubmitted(true); // Set a submitted flag
      // salvo i dati nel AuthContext
      handleLoginOrRegistration(resp);
      navigate("/dashboard");
    } else {
      // Form is not valid, display error messages
      Error("Errore nell'invio dei dati");
    }
  }
  const isFormValid = Object.keys(errors).length === 0;
  return (
    <>
      <div className="container mx-auto px-4">
        <div className="flex justify-center items-center h-screen">
          <div className="w-full max-w-md">
            {/* Form di registrazione con pulsante per tornare alla pagina di login */}
            <form
              className="bg-white shadow-lg rounded px-12 pt-6 pb-8 mb-4"
              onSubmit={onRegistrationSubmit}
            >
              {/* Logo */}
              <div className="w-40 max-w-md m-auto">
                <img
                  className="rounded-3xl object-fill"
                  src={logo.urlLogoNav}
                  alt="Just Post It logo"
                />
              </div>

              {/* Nome Input */}
              <FormInput
                label={"Nome"}
                type={"text"}
                id={"name"}
                placeholder={""}
                value={formData.name}
                onChangeEffect={(e) =>
                  handleInputChange(e, "name", setFormData)
                }
              ></FormInput>
              {errors.name && (
                <div className="error p-1 text-white bg-red-600 rounded">
                  {errors.name}
                </div>
              )}
              {/* Cognome Input*/}

              <FormInput
                label={"Cognome"}
                type={"text"}
                id={"surname"}
                placeholder={""}
                value={formData.surname}
                onChangeEffect={(e) =>
                  handleInputChange(e, "surname", setFormData)
                }
              ></FormInput>
              {errors.surname && (
                <div className="error p-1 text-white bg-red-600 rounded">
                  {errors.surname}
                </div>
              )}
              {/* Email Input */}

              <FormInput
                label={"Email"}
                type={"email"}
                id={"email"}
                placeholder={""}
                value={formData.email}
                onChangeEffect={(e) =>
                  handleInputChange(e, "email", setFormData)
                }
              ></FormInput>
              {errors.email && (
                <div className="error p-1 text-white bg-red-600 rounded">
                  {errors.email}
                </div>
              )}
              {/* Password Input */}
              <FormInput
                label={"Password"}
                type={"password"}
                id={"password"}
                placeholder={""}
                value={formData.password}
                onChangeEffect={(e) =>
                  handleInputChange(e, "password", setFormData)
                }
              ></FormInput>
              {errors.password && (
                <div className="error p-1 text-white bg-red-600 rounded">
                  {errors.password}
                </div>
              )}

              {/* Ripeti Password Input */}
              <FormInput
                label={"Ripeti password"}
                type={"password"}
                id={"repeat_password"}
                placeholder={""}
                value={passwordMatching}
                onChangeEffect={(e) =>
                  handleInputChange(e, "password", setPasswordMatching)
                }
              ></FormInput>
              {errors.passwordMatching && (
                <div className="error p-1 text-white bg-red-600 rounded">
                  {errors.passwordMatching}
                </div>
              )}
              {/* Pulsanti */}
              <div className="flex items-center justify-between py-2">
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded
                focus:outline-none focus:shadow-outline"
                  type="submit"
                >
                  Registrati
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
