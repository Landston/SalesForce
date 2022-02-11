/**
 * @description Disable a element temporarily
 * @param {HTMLElement} element HTML element
 * @param {Number} timeout timeout in ms
 */
export function disableElementTemporary(element, timeout = 5000) {
	if (!element) return;
	element.disabled = true;
	setTimeout(() => {
		element.disabled = false;
	}, timeout);
}

/**
 * @description validate if is passed a recordId or objectApiName
 * throws error if not
 * @param {String} recordId
 * @param {String} objectApiName
 */
export function validateRecordIdObjectApiName(recordId, objectApiName) {
	if (!recordId || recordId.length < 18) {
		throw new Error("No recordId provided");
	}

	if (!objectApiName) {
		throw new Error("No objectApiName provided");
	}
}

/**
 * @description just a simple async wait function to test async functions
 * @param {Number} ms time in ms
 * @returns {Promise}
 */
export function wait(ms) {
	if (ms < 0) ms = 0;
	return new Promise((resolve) => {
		setTimeout(resolve, ms);
	});
}
