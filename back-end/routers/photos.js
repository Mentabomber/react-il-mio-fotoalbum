const express = require("express");
const router = express.Router();
const fs = require("fs");
//controllers
const photosController = require("../controllers/photos");
//middlewares
const authHandlerMiddleware = require("../middlewares/authHandler");
const userIdHandlerMiddleware = require("../middlewares/userIdHandler");
const authRoleHandlerMiddleware = require("../middlewares/authRoleHandler");
const notFound = require("../middlewares/routeNotFound");
//validators
const { checkSchema } = require("express-validator");
const { checkValidity } = require("../middlewares/schemaValidator");
const photoInput = require("../validations/photoInput");

const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const path = `storage/uploads/${req.user.name}/`;
    fs.mkdirSync(path, { recursive: true }); // Creare la directory se non esiste
    cb(null, path);
  },
  filename: (req, file, cb) => {
    console.log(file, "file");
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName); // Nome del file
  },
});

router.post(
  "/",
  authHandlerMiddleware,
  authRoleHandlerMiddleware(["superadmin", "admin"]),
  multer({ storage: storage }).single("image"),
  checkSchema(photoInput),
  checkValidity,
  photosController.store
);

router.get("/:id", photosController.show);

router.get("/", photosController.index);

router.put(
  "/:id",
  authHandlerMiddleware,
  userIdHandlerMiddleware,
  authRoleHandlerMiddleware(["superadmin", "admin"]),
  multer({ storage: storage }).single("image"),
  checkSchema(photoInput),
  checkValidity,
  photosController.update
);

router.put(
  "/published/:id",
  authHandlerMiddleware,
  userIdHandlerMiddleware,
  authRoleHandlerMiddleware(["superadmin", "admin"]),
  multer({ storage: storage }).single("image"),
  // checkSchema(photoInput),
  checkValidity,
  photosController.updatePublishedState
);

router.delete(
  "/:id",
  authHandlerMiddleware,
  userIdHandlerMiddleware,
  authRoleHandlerMiddleware(["superadmin", "admin"]),
  photosController.destroy
);

module.exports = router;
