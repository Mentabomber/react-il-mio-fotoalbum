const { Router } = require("express");
const router = Router();

//controllers
const authController = require("../controllers/auth");

//middlewares
const { checkSchema } = require("express-validator");
const { checkValidity } = require("../middlewares/schemaValidator");
const userRegister = require("../validations/userRegister");
const userLogin = require("../validations/userLogin");

router.post(
  "/register",
  checkSchema(userRegister),
  checkValidity,
  authController.register
);
router.post(
  "/login",
  checkSchema(userLogin),
  checkValidity,
  authController.login
);

module.exports = router;
