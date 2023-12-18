const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { matchedData } = require("express-validator");

async function send(req, res) {
  const sanitizedData = matchedData(req);

  // salvataggio nel db
  const message = await prisma.message.create({
    data: {
      ...sanitizedData,
    },
    select: {
      email: true,
      content: true,
    },
  });

  res.json({ message });
}

module.exports = {
  send,
};
