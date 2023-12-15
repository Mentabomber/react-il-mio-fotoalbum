const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { validationResult } = require("express-validator");

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
  try {
    upload(req, res, async function (err) {
      if (err instanceof multer.MulterError) {
        // Multer ha generato un errore
        return res.status(500).json(err);
      } else if (err) {
        // Errore sconosciuto
        return res.status(500).json(err);
      }

      const image = req.file; // Dati sull'immagine caricata
      const photoToUpdate = req.params;
      const dataToUpdate = req.body;

      const existingPhoto = await prisma.photo.findUnique({
        where: {
          id: parseInt(photoToUpdate.id),
        },
        select: {
          image: true,
        },
      });

      if (!existingPhoto) {
        return res.status(404).send("Photo not found");
      }

      const existingImagePath = existingPhoto.image;

      const updatePhoto = await prisma.photo.update({
        where: {
          id: parseInt(photoToUpdate.id),
        },
        data: {
          title: dataToUpdate.title,
          image: image.path,
          description: dataToUpdate.description,
          published: Boolean(dataToUpdate.published),
          categories: {
            connect: dataToUpdate.categories.map((idCategory) => ({
              id: parseInt(idCategory),
            })),
          },
        },
      });
      if (existingImagePath) {
        fs.unlinkSync(existingImagePath);
        console.log("Immagine precedente eliminata:", existingImagePath);
      }
      return res.json(updatePhoto);
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error });
  }
}

async function destroy(req, res) {
  const photoToDelete = req.params;
  try {
    const deletePhoto = await prisma.photo.delete({
      where: {
        id: parseInt(photoToDelete.id),
      },
    });
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
