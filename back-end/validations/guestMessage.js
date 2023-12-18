const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/**
 * @type {import("express-validator").Schema}
 */
module.exports = {
  email: {
    in: ["body"],
    isEmail: {
      errorMessage: "L'email inserita non è valida",
    },
    notEmpty: {
      errorMessage: "L'email è obbligatoria",
    },
  },
  content: {
    in: ["body"],
    notEmpty: {
      options: {
        ignore_whitespace: true,
      },
      errorMessage: "il messaggio deve avere un contenuto",
    },
    isLength: {
      options: {
        min: 20,
      },
      errorMessage:
        "il contenuto del messaggio deve essere lungo lameno 20 caratteri.",
    },
  },
};
