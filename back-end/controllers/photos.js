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
  console.log(datiInIngresso);
  const user = req.user;
  const query = {
    title: datiInIngresso.title,
    description: datiInIngresso.description,
    published: datiInIngresso.published,
    categories: datiInIngresso.categories,
    image: image.path.replace(/^storage\\/, ""),
  };

  if (datiInIngresso.categories) {
    query.categories = {
      connect: datiInIngresso.categories.split(",").map((idCategory) => ({
        id: +idCategory,
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

async function index(req, res) {
  try {
    const filters = req.query.filter;
    const page = req.query.page || 1;
    const perPage = 20;

    const queryFilter = {};

    if (filters && filters.includes("title eq")) {
      const titleFilter = filters.split("title eq ")[1];
      queryFilter.title = {
        contains: titleFilter,
      };
    }

    if (filters && filters.includes("description eq")) {
      const descriptionFilter = filters.split("description eq ")[1];
      queryFilter.description = {
        contains: descriptionFilter,
      };
    }

    if (filters && filters.includes("published eq")) {
      const publishedFilter = filters.split("published eq ")[1];
      queryFilter.published = {
        equals: publishedFilter === "true" || publishedFilter === "1",
      };
    }
    //filtro per ricerca post tramite userId
    const userId = req.query.userId;
    if (userId) {
      queryFilter.userId = {
        equals: parseInt(userId),
      };
    }
    console.log(userId, "userId", req.query.userId, "req-id");
    const total = await prisma.photo.count({ where: queryFilter });

    const data = await prisma.photo.findMany({
      skip: (page - 1) * perPage,
      take: perPage,
      where: queryFilter,
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

    res.json({ data, page, perPage, total });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
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
async function updatePublishedState(req, res) {
  const id = req.params.id;

  try {
    let datiInIngresso = req.body.published;
    console.log(datiInIngresso);
    if (datiInIngresso === "true") {
      datiInIngresso = false;
    } else {
      datiInIngresso = true;
    }
    console.log(datiInIngresso, "datiiningresso");
    const photo = await prisma.photo.findUnique({
      where: {
        id: parseInt(id),
      },
    });
    if (!photo) {
      throw new Error("Not found");
    }
    const updatePhotoPublished = await prisma.photo.update({
      where: {
        id: parseInt(id),
      },
      data: {
        published: datiInIngresso,
      },
    });
    console.log(datiInIngresso, "dopo");
    return res.json(updatePhotoPublished);
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
  index,
  update,
  updatePublishedState,
  destroy,
};
