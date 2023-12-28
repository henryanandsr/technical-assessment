import "dotenv/config";
import express from "express";

const app = express();
const PORT = 8080;

const userRoutes = require("./routes/user.routes");
const villaRoutes = require("./routes/villa.routes");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api", userRoutes);
app.use("/api", villaRoutes);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
