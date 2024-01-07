import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { verifyJWT } from "./middleware/verifyJWT";

const app = express();
const PORT = 8080;

const userRoutes = require("./routes/user.routes");
const villaRoutes = require("./routes/villa.routes");
const authRoutes = require("./routes/auth.routes");
const transactionRoutes = require("./routes/transaction.routes");
const userProtectedRoutes = require("./routes/userProtected.routes");

const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/api", userRoutes);
app.use("/api", villaRoutes);
app.use("/api", authRoutes);
app.use("/api/transaction", verifyJWT);
app.use("/api/user", verifyJWT);
app.use("/api/user", userProtectedRoutes);
app.use("/api/transaction", transactionRoutes);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
