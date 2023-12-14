const express = require("express");
const router = express.Router();

//controllers
const categoriesController = require("../controllers/categories");

//middlewares
const authHandlerMiddleware = require("../middlewares/authHandler");
const authRoleHandlerMiddleware = require("../middlewares/authRoleHandler");


router.post("/", authHandlerMiddleware, authRoleHandlerMiddleware("superadmin"), categoriesController.store);

router.get("/", categoriesController.showAllCategories);


module.exports = router;