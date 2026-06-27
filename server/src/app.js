import express from "express";
const app = express();

//parse json requ body
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server is running");
});

export default app;
