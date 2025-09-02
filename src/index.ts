import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./db";
import router from "./routes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3020;

app.use(cors());
app.use(express.json());

connectDB();

app.get("/", (req, res) => {
  res.send("The server is running!");
});

app.use("/api", router);

app.listen(PORT, () => {
  console.log(`The server is running on port ${PORT}`);
});
