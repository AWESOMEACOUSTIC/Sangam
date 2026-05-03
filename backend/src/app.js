const cors = require("cors");
const express = require("express");
const apiRouter = require("./routes");
const errorHandler = require("./middleware/error-handler");

const app = express();

const requestLogger = (req, res, next) => {
	console.log(`${req.method} ${req.originalUrl}`);
	next();
};

app.use(express.json());
app.use(cors());
app.use(requestLogger);

app.use("/api/v1", apiRouter);

app.get("/health", (req, res) => {
	res.status(200).json({ status: "ok" });
});

app.use(errorHandler);

module.exports = app;
