const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const multer = require("multer");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const path = `storage/uploads/${req.user.name}/`;
    fs.mkdirSync(path, { recursive: true }); // Creare la directory se non esiste
    cb(null, path);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName); // Nome del file
  },
});

const upload = multer({ storage: storage }).single("image");

async function store(req, res) {
  upload(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      // Multer ha generato un errore
      return res.status(500).json(err);
    } else if (err) {
      // Errore sconosciuto
      return res.status(500).json(err);
    }

    const creationData = req.body;
    const image = req.file; // Dati sull'immagine caricata
    console.log(creationData, "creationData");
    const newPhoto = await prisma.photo
      .create({
        data: {
          title: creationData.title,
          image: image.path,
          description: creationData.description,
          published: Boolean(creationData.published),
          user: {
            connect: {
              id: parseInt(req.user.id),
            },
          },
          categories: {
            connect: creationData.categories.map((idCategory) => ({
              id: parseInt(idCategory),
            })),
          },
        },
      })
      .then((newPhoto) => {
        console.log("Nuova foto aggiunta:", newPhoto);
      })
      .catch((error) => console.error(error));

    return res.json(newPhoto);
  });
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

  console.log(showAllPhotos);
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
