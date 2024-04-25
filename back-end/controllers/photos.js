const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { validationResult } = require("express-validator");
const fs = require("fs");

async function store(req, res, next) {
  const validation = validationResult(req);
  const image = req.file; // Dati sull'immagine caricata
  console.log(req, "req");

  // isEmpty si riferisce all'array degli errori di validazione.
  // Se NON è vuoto, vuol dire che ci sono errori
  if (!validation.isEmpty()) {
    return next(
      new ValidationError("Controllare i dati inseriti", validation.array())
    );
  }
  let datiInIngresso = req.validatedData;
  console.log(datiInIngresso, "dati ingresso");
  if (datiInIngresso.published === "true") {
    datiInIngresso.published = true;
  } else {
    datiInIngresso.published = false;
  }
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
  try {
    const showPhoto = await prisma.photo.findUnique({
      where: {
        id: parseInt(showInputData.id),
      },
      include: {
        categories: {
          select: {
            id: true,
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
    return res.json(showPhoto);
  } catch (error) {
    console.log(error);
  }

  // if (!showPhoto) {
  //   throw new Error("Not found");
  // }
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
            id: true,
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
  const validation = validationResult(req);
  // isEmpty si riferisce all'array degli errori di validazione.
  // Se NON è vuoto, vuol dire che ci sono errori
  if (!validation.isEmpty()) {
    return next(
      new ValidationError("Controllare i dati inseriti", validation.array())
    );
  }
  const id = req.params.id;

  let datiInIngresso = req.validatedData;
  console.log(datiInIngresso, "dati ingresso");
  if (datiInIngresso.published === "true") {
    datiInIngresso.published = true;
  } else {
    datiInIngresso.published = false;
  }
  if (req.file) {
    let image = req.file;
    console.log(image, "image");
    try {
      const categoriesList = await prisma.category.findMany();

      datiInIngresso.image = image.filename;
      const photo = await prisma.photo.findUnique({
        where: {
          id: parseInt(id),
        },
      });

      if (!photo) {
        throw new Error("Not found");
      }
      // Get the IDs of categories to disconnect

      const categoryIdsToDisconnect = categoriesList
        .filter((cat) => !datiInIngresso.categories.includes(cat.id.toString()))
        .map((cat) => ({ id: cat.id }));

      const updatePhoto = await prisma.photo.update({
        where: {
          id: parseInt(id),
        },
        data: {
          title: datiInIngresso.title,
          image: image.path.replace(/^storage\\/, ""),
          description: datiInIngresso.description,
          published: datiInIngresso.published,
          categories: {
            connect: datiInIngresso.categories.split(",").map((idCategory) => ({
              id: parseInt(idCategory),
            })),
            disconnect: categoryIdsToDisconnect, // Disconnect categories not found in datiInIngresso.categories
          },
        },
        include: {
          categories: true,
          user: true,
        },
      });

      if (photo.image) {
        fs.unlinkSync("storage/" + photo.image);
        console.log("Immagine precedente eliminata:", photo.image);
      }
      return res.json(updatePhoto);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error });
    }
  } else {
    const categoriesList = await prisma.category.findMany();

    const photo = await prisma.photo.findUnique({
      where: {
        id: parseInt(id),
      },
    });
    if (!photo) {
      throw new Error("Not found");
    }
    // Get the IDs of categories to disconnect
    const categoryIdsToDisconnect = categoriesList
      .filter((cat) => !datiInIngresso.categories.includes(cat.id.toString()))
      .map((cat) => ({ id: cat.id }));

    const updatePhoto = await prisma.photo.update({
      where: {
        id: parseInt(id),
      },
      data: {
        title: datiInIngresso.title,
        description: datiInIngresso.description,
        published: datiInIngresso.published,
        categories: {
          connect: datiInIngresso.categories.split(",").map((idCategory) => ({
            id: parseInt(idCategory),
          })),
          disconnect: categoryIdsToDisconnect, // Disconnect categories not found in datiInIngresso.categories
        },
      },
      include: {
        categories: true,
        user: true,
      },
    });
    return res.json(updatePhoto);
  }
}
async function updatePublishedState(req, res) {
  const id = req.params.id;

  try {
    const categoriesList = await prisma.category.findMany();
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
    console.log(photo, "photo");
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
      fs.unlinkSync("storage/" + deletePhoto.image);
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
