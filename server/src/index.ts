import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import financialRoutes from "./routes/financial-records";
import incomeRoutes from "./routes/income-records";
import budgetRoutes from "./routes/budget-record";

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// ✅ Use the route files
app.use("/financial-records", financialRoutes);
app.use("/income", incomeRoutes); // ✅ Add this
app.use("/budgets", budgetRoutes); // ✅ Add this

// ✅ Connect to MongoDB
const mongoURI: string =
  "mongodb+srv://okamberi32:1a51Z00KdB9JEec5@personalfinance-cluster.9bapgxw.mongodb.net/";
mongoose
  .connect(mongoURI)
  .then(() => console.log("Connected to MONGODB"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
