import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Mock data for NASA C-MAPSS FD001
  // In a real app, this would come from a database or the actual dataset files
  app.get("/api/sensors/history/:unitId", (req, res) => {
    const { unitId } = req.params;
    const history = [];
    const baseS4 = 550; // Temperature
    const baseS11 = 47;  // Pressure
    const baseS12 = 521; // Pressure
    
    // Generate 50 cycles of history
    for (let i = 1; i <= 50; i++) {
      history.push({
        cycle: i,
        s4: baseS4 + (i * 0.5) + (Math.random() * 5),
        s11: baseS11 + (i * 0.02) + (Math.random() * 0.5),
        s12: baseS12 - (i * 0.1) + (Math.random() * 2),
        vibration: 10 + (i * 0.1) + (Math.random() * 1),
      });
    }
    res.json({ unitId, history });
  });

  app.get("/api/units", (req, res) => {
    const units = Array.from({ length: 10 }, (_, i) => ({
      id: i + 1,
      status: Math.random() > 0.8 ? "Warning" : "Healthy",
      lastCycle: 50,
      healthScore: Math.floor(Math.random() * 30) + 70,
    }));
    res.json(units);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
