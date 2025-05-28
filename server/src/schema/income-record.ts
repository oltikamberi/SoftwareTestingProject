import mongoose from "mongoose";

const incomeRecordSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  date: { type: Date, required: true },
  source: { type: String, required: true },
  amount: { type: Number, required: true },
});

const IncomeRecordModel = mongoose.model("IncomeRecord", incomeRecordSchema);
export default IncomeRecordModel;
