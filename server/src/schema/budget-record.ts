import mongoose from "mongoose";

const budgetRecordSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  category: { type: String, required: true },
  monthlyLimit: { type: Number, required: true },
});

const BudgetRecordModel = mongoose.model("BudgetRecord", budgetRecordSchema);
export default BudgetRecordModel;
