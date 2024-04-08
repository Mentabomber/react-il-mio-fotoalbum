/**
 * @type {import("express-validator").Schema}
 */
module.exports = {
  title: {
    in: ["body"],
    notEmpty: {
      options: {
        ignore_whitespace: true,
      },
      errorMessage: "Il titolo è obbligatorio",
    },
    isLength: {
      options: {
        min: 1,
      },
      errorMessage: "Il titolo deve contenere almeno un carattere",
    },
  },
  description: {
    in: ["body"],
    notEmpty: {
      options: {
        ignore_whitespace: true,
      },
      errorMessage: "la descrizione deve avere del contenuto",
    },
    isLength: {
      options: {
        min: 1,
      },
      errorMessage: "la descrizione deve avere almeno un carattere",
    },
  },
  image: {
    custom: {
      options: (value, { req }) => {
        console.log(req.method, "req");
        // Verifica se è stato fornito un file
        if (!req.file) {
          if (req.method === "PUT") {
            return true;
          } else {
            throw new Error("L'immagine è obbligatoria");
          }
        }

        // Verifica il tipo di file (puoi personalizzare i tipi supportati)
        const supportedTypes = [
          "image/jpeg",
          "image/png",
          "image/gif",
          "image/webp",
        ];
        if (!supportedTypes.includes(req.file.mimetype)) {
          throw new Error("Il formato dell'immagine non è supportato");
        }

        // Verifica le dimensioni dell'immagine (puoi personalizzare le dimensioni consentite)
        const maxSizeInBytes = 5 * 1024 * 1024; // 5 MB
        if (req.file.size > maxSizeInBytes) {
          throw new Error("L'immagine deve essere inferiore a 5 MB");
        }

        // Se tutte le verifiche passano, restituisci true
        return true;
      },
    },
  },
  categories: {
    custom: {
      options: (value) => {
        // Verifica se è stata fornita almeno una categoria
        if (!value || value.length === 0) {
          throw new Error("Devi selezionare almeno una categoria");
        }

        // Se tutte le verifiche passano, restituisci true
        return true;
      },
    },
  },
};
