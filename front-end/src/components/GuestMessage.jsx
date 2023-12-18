import { useState } from "react";
import { handleInputChange } from "../utils/handleInputChange";
import fetchApi from "../utils/fetchApi";

export default function MessageSender() {
  const [formData, setFormData] = useState({
    email: "",
    content: "",
  });

  async function sendMessage() {
    try {
      // Effettua la richiesta API per inviare il messaggio al database
      await fetchApi("/messages", "POST", formData);

      setFormData({
        email: "",
        content: "",
      });

      console.log("Messaggio inviato con successo!");
    } catch (error) {
      console.error("Errore nell'invio del messaggio:", error);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    sendMessage();
  }

  return (
    <div className="container mx-auto px-4">
      <form
        className="bg-white shadow-lg rounded px-12 pt-6 pb-8 mb-4"
        onSubmit={handleSubmit}
      >
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

        {/* Content */}
        <div className="mb-6">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="content"
          >
            Messaggio
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3
            leading-tight focus:outline-none focus:shadow-outline"
            id="content"
            type="text"
            placeholder="Scrivi cosa pensi"
            value={formData.content}
            onChange={(e) => handleInputChange(e, "content", setFormData)}
          />
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
        </div>
      </form>
    </div>
  );
}
