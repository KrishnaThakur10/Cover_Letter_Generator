import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import routes from "./routes/resume.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: [process.env.Frontend_URL], // Add your frontend URLs
    credentials: true,
  })
);
app.use(express.json());

app.use("/api/resume", routes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
