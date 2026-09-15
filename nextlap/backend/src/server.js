import "dotenv/config";
import express from "express";
import cors from "cors";
import api from "./routes/api.js";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use("/api", api);

app.use((_, res) => res.status(404).json({ error: "Route not found" }));

app.listen(PORT, "0.0.0.0", () => console.log(`NextLap API running on http://localhost:${PORT} | Groq: ${process.env.GROQ_API_KEY ? "configured" : "MISSING"} | Model: ${process.env.GROQ_MODEL || "openai/gpt-oss-120b"}`));
