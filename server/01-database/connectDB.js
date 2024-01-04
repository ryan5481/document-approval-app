const mongoose = require('mongoose');
require('dotenv').config()

// const connectDb = async () => {
//   try {
//     await mongoose.connect(process.env.MONGO_URI)
//     console.log(`Connected to ${process.env.MONGO_URI}`);
//   }
//   catch (error) {
//     console.log(error);
//   }
// }

const connectDb = async () => {
  try {
    mongoose.set('strictQuery', true);
    const data = await mongoose.connect(process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/data-approval-app-nextjs');
    if (data) console.log("connected to monngodb")
  } catch (err) {
    console.log("Db Connection error", err)
  }
}

module.exports = connectDb

