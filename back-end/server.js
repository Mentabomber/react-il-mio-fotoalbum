const express = require("express");
const dotenv = require("dotenv");

//routes
const photosRouter = require("./routers/photos");
const categoriesRouter = require("./routers/categories");
const authRouter = require("./routers/auth");

//middlewares
const errorsHandlerMiddleware = require("./middlewares/errorsHandler");
const routeNotFoundMiddleware = require("./middlewares/routeNotFound");

//cors
const cors = require("cors");

dotenv.config();

const app = express();
const port = process.env.PORT || 3306;
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log("Request:", req.url);
  next();
});
app.use(express.static("public"));
app.use(express.static("storage"));

app.use("/photos", photosRouter);

app.use("/categories", categoriesRouter);

app.use("", authRouter);

app.use(errorsHandlerMiddleware);

app.use(routeNotFoundMiddleware);

app.listen(port, () => {
  console.log(`Example app listening on http://localhost:${port}`);
});
