import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import campaignRoutes from "./routes/campaignRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/campaigns", campaignRoutes);


mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("MongoDB Connected"))
.catch((err) => console.error("DB Connection Error:", err));

app.get("/", (req, res) => {
    res.send("Crowdcube Server is Running!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
