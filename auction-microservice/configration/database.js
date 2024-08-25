import mongoose from "mongoose";
import { config } from "dotenv";
config();

const URL = process.env.MONGODB_URL;

const connectDb = async () => {
  try {
    await mongoose.connect(URL);
    console.log("db is connected to Auction-microservice Database");
  } catch (error) {
    console.log("Error in connectin with DB", error);
    console.log("db is not connected");
  }
};

export default connectDb;
