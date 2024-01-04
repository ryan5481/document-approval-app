const express = require('express');
const app = express();
const cors = require("cors");
require('dotenv').config()

const userRoutes = require("./05-routes/00-userRoutes.js")


const connectDb = require('./01-database/connectDB.js');


const port = process.env.PORT || 8000;

connectDb()

app.use(express.json());
app.use(cors());
//USER
app.use("/", userRoutes)

//ADMIN


app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
