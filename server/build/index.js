"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const financial_records_1 = __importDefault(require("./routes/financial-records"));
const app = (0, express_1.default)();
const port = process.env.PORT || 3001;
app.use(express_1.default.json());
//Lidhja me databaze
const mongoURI = "mongodb+srv://okamberi32:1a51Z00KdB9JEec5@personalfinance-cluster.9bapgxw.mongodb.net/";
mongoose_1.default
    .connect(mongoURI)
    .then(() => console.log("CONNECTED TO MONGODB"))
    .catch((err) => console.error("Failed to Connect to MongoDB", err));
app.use("/financial-records", financial_records_1.default);
app.listen(port, () => {
    console.log(`Server running on portin ${port}`);
});
