import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";

const app = express();
const PORT = 8080;

const userRoutes = require("./routes/user.routes");
const villaRoutes = require("./routes/villa.routes");
const authRoutes = require("./routes/auth.routes");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/api", userRoutes);
app.use("/api", villaRoutes);
app.use("/api", authRoutes);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
