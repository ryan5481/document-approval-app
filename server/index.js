const express = require('express');
const app = express();
const cors = require("cors");
require('dotenv').config()

const userRoutes = require("./05-routes/00-userRoutes.js")
const dataDocumentRoutes = require("./05-routes/01-documentFileRoutes.js")
const commentRoutes = require("./05-routes/03-statusRoutes.js")


const connectDb = require('./01-database/connectDB.js');


const port = process.env.PORT || 8000;

connectDb()

app.use(express.json());
app.use(cors());

//USER
app.use("/", userRoutes)
app.use("/", dataDocumentRoutes)
app.use("/", commentRoutes)

//ADMIN


app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
