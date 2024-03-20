/**
 *
 * @param {Event} e Evento del input
 * @param {string} key Chiave dell'oggetto che deve essere aggiornato
 * @param {Function} setterCb Funzione che aggiorna lo stato dell'oggetto
 */
export function handleInputChange(e, key, setterCb) {
  const value = e.target.value;
  const checked = e.target.checked;

  let newValue = e.target.type === "checkbox" ? checked : value;

  setterCb((prev) => {
    return {
      ...prev,
      [key]: newValue,
    };
  });
}
