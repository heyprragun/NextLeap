import express from "express";
import cors from "cors";
import api from "./routes/api.js";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use("/api", api);

app.use((_, res) => res.status(404).json({ error: "Route not found" }));

app.listen(PORT, "0.0.0.0", () => console.log(`NextLap API running on http://localhost:${PORT}`));
