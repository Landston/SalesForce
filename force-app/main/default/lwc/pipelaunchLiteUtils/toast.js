import { ShowToastEvent } from "lightning/platformShowToastEvent";
import { reduceErrorsString } from "./errors";

/**
 * @description Display toasts to provide feedback to a user following an action, such as after a record is created
 * @param {Object}          options options
 * @param {string}          title (Required) The title of the toast, displayed as a heading
 * @param {string}          message (Required) A string representing the body of the message. It can contain placeholders in the form of {0} ... {N}. The placeholders are replaced with the links on messageData.
 * @param {string[]|Object} messageData url and label values that replace the {index} placeholders in the message string.
 * @param {string}          variant  info (default), success, warning, and error
 * @param {string}          mode dismissible (default) Determines how persistent the toast is. Valid values are: dismissible (default), remains visible until you click the close button or 3 seconds has elapsed, whichever comes first; pester, remains visible for 3 seconds and disappears automatically. No close button is provided; sticky, remains visible until you click the close button.
 */
export function toast({
	title = "",
	message = "",
	variant = "info",
	messageData = null,
	mode = "dismissible"
}) {
	try {
		if (!title && !message) {
			title = "Toast message";
		}
		document.body.dispatchEvent(
			new ShowToastEvent({
				title,
				message,
				variant,
				messageData,
				mode
			})
		);
	} catch (error) {
		console.error("Cannot display toast message", error);
	}
}

/**
 * @description Display error toast with the following default options: variant error, mode dismissible
 * @param {Object}          options options
 * @param {string}          title (Required) The title of the toast, displayed as a heading
 * @param {string}          error (Required) Error message
 */
export function errorToast({ title = "", error = "" }) {
	try {
		const message = reduceErrorsString(error);

		document.body.dispatchEvent(
			new ShowToastEvent({
				title,
				message,
				variant: "error"
			})
		);
	} catch (error) {
		console.error("Cannot display toast message", error);
	}
}
