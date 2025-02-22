const express = require("express");
const app = express();
const PORT = process.env.PORT || 8800;
const cors = require("cors");
require("dotenv").config();

app.use(
    cors({
      origin: "http://localhost:3000", // Allow frontend origin
      credentials: true, // Allow cookies and authentication headers
    })
  );
app.use(express.json());

const connectDB = require("./config/database");
const userRoutes = require("./routes/user");

app.get("/", (req, res) => {
    // res.status(200).json({ message: "Hello from EMOTORAD backend server" });
    res.send("<a href='/api/user/auth/google'>Login with google</a>");
});
app.use("/api/user", userRoutes);

connectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server start http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.error("Failed to connect to the database:", err.message);
        process.exit(1);
    });