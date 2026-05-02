const express = require("express");
const apiRouter = require("./routes");

const app = express();

app.use(express.json());

app.use("/api/v1", apiRouter);

app.get("/health", (req, res) => {
	res.status(200).json({ status: "ok" });
});

module.exports = app;
