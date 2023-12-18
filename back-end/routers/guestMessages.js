const { Router } = require("express");
const router = Router();

//controllers
const guestMessages = require("../controllers/guestMessages");

//middlewares
const { checkSchema } = require("express-validator");
const { checkValidity } = require("../middlewares/schemaValidator");
const guestMessage = require("../validations/guestMessage");

router.post("/", checkSchema(guestMessage), checkValidity, guestMessages.send);

module.exports = router;
