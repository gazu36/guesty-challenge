const { validationResult } = require('express-validator');

const { StatusCodes } = require('http-status-codes');

const validateNoErrors = (req, res, next) => {
	const errors = validationResult(req);
	if (errors.isEmpty()) {
		return next();
	}
	const extractedErrors = [];
	errors.array().map((err) => extractedErrors.push({ [err.param]: err.msg }));

	return res.status(StatusCodes.BAD_REQUEST).json({
		errors: extractedErrors
	});
};

module.exports = validateNoErrors;
