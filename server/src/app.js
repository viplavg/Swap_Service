import express from 'express';
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import authRoutes from './routes/auth.routes.js';
import shiftRoutes from './routes/shift.routes.js';
import swapRoutes from './routes/swap.routes.js';

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));


// Health Check 
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running successfully",
  });
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/shifts", shiftRoutes);
app.use("/api/v1/swaps", swapRoutes);


export default app;