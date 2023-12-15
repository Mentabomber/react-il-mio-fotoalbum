const express = require("express");
const router = express.Router();
const fs = require("fs");
//controllers
const photosController = require("../controllers/photos");
//middlewares
const authHandlerMiddleware = require("../middlewares/authHandler");
const userIdHandlerMiddleware = require("../middlewares/userIdHandler");
const authRoleHandlerMiddleware = require("../middlewares/authRoleHandler");
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
  authRoleHandlerMiddleware("superadmin"),
  multer({ storage: storage }).single("image"),
  checkSchema(photoInput),
  checkValidity,
  photosController.store
);

router.get("/:id", photosController.show);

router.get("/", photosController.showAll);

router.put(
  "/:id",
  authHandlerMiddleware,
  userIdHandlerMiddleware,
  authRoleHandlerMiddleware("superadmin"),
  multer({ storage: storage }).single("image"),
  checkSchema(photoInput),
  checkValidity,
  photosController.update
);

router.delete(
  "/:id",
  authHandlerMiddleware,
  userIdHandlerMiddleware,
  authRoleHandlerMiddleware("superadmin"),
  photosController.destroy
);

module.exports = router;
