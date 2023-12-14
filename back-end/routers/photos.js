const express = require("express");
const router = express.Router();
//controllers
const photosController = require("../controllers/photos");
//middlewares
const authHandlerMiddleware = require("../middlewares/authHandler");
const userIdHandlerMiddleware = require("../middlewares/userIdHandler");


router.post("/", photosController.store);

router.get("/:id", photosController.show);

router.get("/", photosController.showAll);

router.put("/:id", authHandlerMiddleware, userIdHandlerMiddleware, photosController.update);

router.delete("/:id", authHandlerMiddleware, userIdHandlerMiddleware, photosController.destroy);


module.exports = router;