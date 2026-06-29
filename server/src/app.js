import express from "express";
import authRoutes from "./routes/authRoute.js";
import errorHandler from "./middleware/errorMiddleware.js";

const app = express();

app.use(express.json());

app.use("/api/auth", authRoutes);

app.use(errorHandler);

app.get("/", (req, res) => {
    res.send("Server is running");
});

export default app; 