/**
 * @description generate the content of the toast message with the errors
 * produced by the lightning-record-form
 * @param {object} e the error object produced by the lightning-record-form
 * @returns {object} sample {message: "x", title: "y"}
 */
export function generateToastErrorMessageContent(e) {
	let _e$message,
		_e$output$errors,
		_e$output,
		_e$output$fieldErrors,
		_e$output2,
		_e$output2$fieldError;

	const title =
		(_e$message = e.message) !== null && _e$message !== void 0
			? _e$message
			: "An error occurred. Please try again.";
	const genericErrors =
		(_e$output$errors =
			(_e$output = e.output) === null || _e$output === void 0
				? void 0
				: _e$output.errors) !== null && _e$output$errors !== void 0
			? _e$output$errors
			: [];
	const fieldErrors =
		(_e$output$fieldErrors =
			(_e$output2 = e.output) === null || _e$output2 === void 0
				? void 0
				: (_e$output2$fieldError = _e$output2.fieldErrors) === null ||
				  _e$output2$fieldError === void 0
				? void 0
				: _e$output2$fieldError.Name) !== null &&
		_e$output$fieldErrors !== void 0
			? _e$output$fieldErrors
			: [];

	const errorMessages = [];
	[...fieldErrors, ...genericErrors].map((item) => {
		errorMessages.push(item.message);
	});
	const message = errorMessages.join("; ");

	return { title, message };
}

/**
 * @description Reduces one or more LDS errors into a string[] of error messages.
 * @param {FetchResponse|FetchResponse[]} errors
 * @return {String[]} Error messages
 */
export function reduceErrors(errors) {
	if (!Array.isArray(errors)) {
		errors = [errors];
	}

	return errors
		.filter((error) => !!error)
		.map((error) => {
			if (Array.isArray(error.body)) {
				return error.body.map((e) => e.message);
			} else if (error.body && typeof error.body.message === "string") {
				return error.body.message;
			} else if (error.body && typeof error.body.message === "object") {
				return error.body.message.map((e) => e.message);
			} else if (typeof error.message === "string") {
				return error.message;
			}
			return error.statusText;
		})
		.reduce((prev, curr) => prev.concat(curr), [])
		.filter((message) => !!message);
}

/**
 * @description Reduce errors and outputs in string format separated by |
 * @param {FetchResponse|FetchResponse[]} errors
 * @returns {String} List of errors
 */
export function reduceErrorsString(errors) {
	const errorsArray = reduceErrors(errors);
	return errorsArray.join(" | ");
}

/**
 * @description	get error exception type
 * @param {Object} errors
 * @returns {String} error exceptionType
 */
export function getErrorExceptionType(errors) {
	if (!Array.isArray(errors)) errors = [errors];

	if (!errors || errors.length === 0) return "";

	if (!Object.prototype.hasOwnProperty.call(errors[0], "body")) return "";
	if (!Object.prototype.hasOwnProperty.call(errors[0].body, "exceptionType"))
		return "";

	return errors[0].body.exceptionType.toString();
}
