const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { validationResult } = require("express-validator");
const fs = require("fs");

async function store(req, res, next) {
  const validation = validationResult(req);
  const image = req.file; // Dati sull'immagine caricata

  // isEmpty si riferisce all'array degli errori di validazione.
  // Se NON è vuoto, vuol dire che ci sono errori
  if (!validation.isEmpty()) {
    return next(
      new ValidationError("Controllare i dati inseriti", validation.array())
    );
  }
  const datiInIngresso = req.validatedData;
  const user = req.user;
  const query = {
    title: datiInIngresso.title,
    description: datiInIngresso.description,
    published: datiInIngresso.published,
    categories: datiInIngresso.categories,
    image: image.path,
  };

  if (datiInIngresso.categories) {
    query.categories = {
      connect: datiInIngresso.categories.map((idCategories) => ({
        id: parseInt(idCategories),
      })),
    };
  }

  if (user) {
    query.user = {
      connect: {
        id: parseInt(user.id),
      },
    };
  }

  const newPhoto = await prisma.photo.create({
    data: query,
    include: {
      categories: true,
      user: true,
    },
  });

  return res.json(newPhoto);
}

async function show(req, res) {
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
      user: {
        select: {
          email: true,
          name: true,
          surname: true,
        },
      },
    },
  });
  if (!showPhoto) {
    throw new Error("Not found");
  }

  return res.json(showPhoto);
}

async function showAll(req, res) {
  const showAllPhotos = await prisma.photo.findMany({
    include: {
      categories: {
        select: {
          type: true,
          description: true,
        },
      },
      user: {
        select: {
          email: true,
          name: true,
          surname: true,
        },
      },
    },
  });

  return res.json(showAllPhotos);
}

async function update(req, res) {
  const file = req.file;
  const id = req.params.id;
  const datiInIngresso = req.validatedData;
  try {
    if (file) {
      datiInIngresso.image = file.filename;
    }
    const photo = await prisma.photo.findUnique({
      where: {
        id: parseInt(id),
      },
    });
    if (!photo) {
      throw new Error("Not found");
    }
    const updatePhoto = await prisma.photo.update({
      where: {
        id: parseInt(id),
      },
      data: {
        title: datiInIngresso.title,
        image: file.path,
        description: datiInIngresso.description,
        published: Boolean(datiInIngresso.published),
        categories: {
          connect: datiInIngresso.categories.map((idCategory) => ({
            id: parseInt(idCategory),
          })),
        },
      },
    });
    if (photo.image) {
      fs.unlinkSync(photo.image);
      console.log("Immagine precedente eliminata:", photo.image);
    }
    return res.json(updatePhoto);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error });
  }
}

async function destroy(req, res) {
  const photoToDelete = req.params;
  console.log(photoToDelete);
  try {
    const deletePhoto = await prisma.photo.delete({
      where: {
        id: parseInt(photoToDelete.id),
      },
      select: {
        image: true,
      },
    });
    if (deletePhoto.image) {
      fs.unlinkSync(deletePhoto.image);
      console.log("Immagine eliminata:", deletePhoto.image);
    }
    return res.json(deletePhoto);
  } catch (error) {
    res.status(404).send("not found");
  }
}

module.exports = {
  store,
  show,
  showAll,
  update,
  destroy,
};
