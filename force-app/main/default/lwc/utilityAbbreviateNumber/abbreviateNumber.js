/**
 * Abbreviate Number
 *
 * Adapted from:
 * https://stackoverflow.com/questions/10599933/convert-long-number-into-abbreviated-string-in-javascript-with-a-special-shortn/32638472
 *
 * @param {Number} num value to proccess
 * @param {Number} fixed number of decimal places to show
 * @returns {String}
 */
export default function abbreviateNumber(num, fixed) {
	if (typeof num === "string") {
		num = parseInt(num, 10);
	}

	if (isNaN(num) || num === null) {
		return "";
	} else if (num === 0) {
		return "0";
	}

	fixed = !fixed || fixed < 0 ? 0 : fixed; // number of decimal places to show

	let b = num.toPrecision(2).split("e"); // get power

	let k = b.length === 1 ? 0 : Math.floor(Math.min(b[1].slice(1), 14) / 3); // floor at decimals, ceiling at trillions
	let c =
		k < 1
			? num.toFixed(0 + fixed)
			: (num / Math.pow(10, k * 3)).toFixed(1 + fixed); // divide by power
	let d = c < 0 ? c : Math.abs(c); // enforce -0 is 0
	let e = d + ["", "k", "m", "b", "t"][k]; // append power
	return e.toString();
}
