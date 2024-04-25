const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const WrongUser = require("../exceptions/WrongUser");
const jsonwebtoken = require("jsonwebtoken");

/**
 *
 * @param {import("express").Request} req
 * @param {*} res
 * @param {*} next
 */
module.exports = async (req, res, next) => {
  const bearer = req.headers.authorization;

  const token = bearer.split(" ")[1];
  const user = jsonwebtoken.verify(token, process.env.JWT_SECRET);
  const showInputData = req.params;

  const showPhoto = await prisma.photo.findUnique({
    where: {
      id: parseInt(showInputData.id),
    },
    include: {
      categories: {
        select: {
          type: true,
          description: true,
        },
      },
      user: true,
    },
  });
  if (!showPhoto) {
    throw new Error("Not found");
  }
  // if the user is a superadmin skip the other rules
  if (user.role !== "superadmin") {
    if (!(showPhoto.user.id === user.id)) {
      throw new WrongUser(
        "Non puoi cancellare questa foto perché non sei l'utente che la ha creata"
      );
    }
  }

  // Continue to the next middleware or route handler
  next();
};
