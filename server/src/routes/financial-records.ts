import express, { Request, Response } from "express";
import FinancialRecordModel from "../schema/financial-record";

const router = express.Router();

//nese del naj error munesh me kqyr qet pjese qe e ke ba me ai me ba qysh e ka bo yt veq pa returns te res.
//Get

router.get<{ userId: string }>(
  "/getAllByUserID/:userId",
  async (req: Request<{ userId: string }>, res: Response) => {
    try {
      const userId = req.params.userId;
      const records = await FinancialRecordModel.find({ userId });

      if (records.length === 0) {
        res.status(404).send("No records found for the userin."); // No return
        return; // Explicit return to exit function
      }

      res.status(200).send(records); // No return
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Unknown errori";
      res.status(500).send(errorMessage); // No return
    }
  }
);

//Post
router.post("/", async (req: Request, res: Response) => {
  try {
    const newRecordBody = req.body;
    const newRecord = new FinancialRecordModel(newRecordBody);
    const savedRecord = await newRecord.save();

    res.status(200).send(savedRecord);
  } catch (err) {
    res.status(500).send(err);
  }
});

//Put
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const newRecordBody = req.body;
    const record = await FinancialRecordModel.findByIdAndUpdate(
      id,
      newRecordBody
    );

    if (!record) res.status(404).send();

    res.status(200).send(record);
  } catch (err) {
    res.status(500).send(err);
  }
});

//Delete
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const record = await FinancialRecordModel.findByIdAndDelete(id);
    if (!record) res.status(404).send();

    res.status(200).send(record);
  } catch (err) {
    res.status(500).send(err);
  }
});

export default router;
