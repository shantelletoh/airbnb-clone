const express = require("express");
const cors = require("cors"); // to connect client and server
const app = express();

app.use(express.json());
app.use(
  cors({
    credentials: true,
    origin: "http://127.0.0.1:5173",
  })
);

app.get("/test", (req, res) => {
  res.json("test ok");
});

app.post("/register", (req, res) => {
  const { name, email, password } = req.body;
  res.json({ name, email, password });
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
