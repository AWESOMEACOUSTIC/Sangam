const express = require("express");
const apiRouter = require("./routes");
const errorHandler = require("./middleware/error-handler");

const app = express();

app.use(express.json());

app.use("/api/v1", apiRouter);

app.get("/health", (req, res) => {
	res.status(200).json({ status: "ok" });
});

app.use(errorHandler);

module.exports = app;
