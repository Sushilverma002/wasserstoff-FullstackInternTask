import connectDb from "./configration/database.js";
import express from "express";
import router from "./routes/index.js";
import cors from "cors";
const app = express();
const port = process.env.PORT || 4002;

app.use(cors());
app.use(express.json());
app.use("/api/v2/auction", router);

const start = async () => {
  try {
    await connectDb(process);
    app.listen(port, () => {
      console.log(`Yes I am connected`);
    });
  } catch (error) {
    console.log(error);
  }
};
start();
