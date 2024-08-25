import MongoDB from "./configration/databaseConfig.js";
import express, { json } from "express";
import router from "./routes/index.js";
import cors from "cors";
const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use("/api/v1/user", router);

const start = async () => {
  try {
    await MongoDB(process);
    app.listen(port, () => {
      console.log(`Yes I am connected`);
    });
  } catch (error) {
    console.log(error);
  }
};
start();
