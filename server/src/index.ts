import express, { Express } from "express";
import mongoose from "mongoose";
import financialRecordRouter from "./routes/financial-records";

const app: Express = express();
const port = process.env.PORT || 3001;

app.use(express.json());

//Lidhja me databaze
const mongoURI: string =
  "mongodb+srv://okamberi32:1a51Z00KdB9JEec5@personalfinance-cluster.9bapgxw.mongodb.net/";

mongoose
  .connect(mongoURI)
  .then(() => console.log("CONNECTED TO MONGODB"))
  .catch((err) => console.error("Failed to Connect to MongoDB", err));

app.use("/financial-records", financialRecordRouter);

app.listen(port, () => {
  console.log(`Server running on portin ${port}`);
});
