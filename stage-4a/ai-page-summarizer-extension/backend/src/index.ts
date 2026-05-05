import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import summarizeRoute from "./routes/summarize.js";

dotenv.config();

const app = express();

app.use(cors());

app.use(express.json());

app.use("/summarize", summarizeRoute);

app.get("/", (_, res) => {
  res.json({
    message: "AI Page Summarizer Backend Running",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
