function errorHandler(err, req, res, next) {
	if (res.headersSent) {
		return next(err);
	}

	const status = err?.statusCode || 500;
	res.status(status).json({
		code: err?.code || "internal_error",
		message: err?.message || "Unexpected error",
	});
}

module.exports = errorHandler;
