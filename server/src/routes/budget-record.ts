import express from "express";
import BudgetRecordModel from "../schema/budget-record";

const router = express.Router();

router.get("/getAllByUserID/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const records = await BudgetRecordModel.find({ userId });
    res.status(200).send(records);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.post("/", async (req, res) => {
  try {
    const newRecord = new BudgetRecordModel(req.body);
    const saved = await newRecord.save();
    res.status(200).send(saved);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.put("/:id", async (req, res) => {
  try {
    const updated = await BudgetRecordModel.findByIdAndUpdate(
      req.params.id,
      req.body
    );
    res.status(200).send(updated);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deleted = await BudgetRecordModel.findByIdAndDelete(req.params.id);
    res.status(200).send(deleted);
  } catch (err) {
    res.status(500).send(err);
  }
});

export default router;
