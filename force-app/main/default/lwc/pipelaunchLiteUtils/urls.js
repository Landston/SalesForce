function _isAbsoluteUrl(url) {
	const URL_CHECK_REGEX = /^(\/+|\.+|ftp|http(s?):\/\/)/i;
	return URL_CHECK_REGEX.test(url);
}

/**
 * @description add the protocol to the url (if it's missing), otherwise it
 * will a relative link inside the salesforce
 * @param {string} url
 * @returns {string}
 */
export function makeAbsoluteUrl(url) {
	return _isAbsoluteUrl(url) ? url : `http://${url}`;
}

export function extractLinkedInCompanyUrlPart(url) {
	if (!url || url.trim().length === 0) return "";
	return url
		.replace(
			/^(http(s?):\/\/(www\.|[a-z]{2}\.)|http(s?):\/\/)linkedin\.com\/company/gi,
			""
		)
		.replace(/\/$/g, "");
}

/**
 * @description extract the linkedin profile name from the url
 * @param {String} linkedinprofileurl eg "https://www.linkedin.com/in/johndoe"
 * @returns {String} eg "johndoe"
 */
export function extractLinkedInProfileName(linkedinprofileurl = "") {
    if (!linkedinprofileurl) return "";
    linkedinprofileurl = linkedinprofileurl.replace(
        /^(.*?\.)?linkedin\.com\/(in|profile|m\/in|mwlite\/in|company)\//i,
        ""
    );
    linkedinprofileurl = linkedinprofileurl.replace(/\?.*$/, ""); // get parameter
	linkedinprofileurl = linkedinprofileurl.replace(/\/.*$/, ""); // replace everything after the slash
    return linkedinprofileurl;
}

export function removeHttpFromUrl(url) {
	if (!url || url.trim().length === 0) return "";
	return url.replace(/http(s?):\/\//gi, "");
}

// https://gist.github.com/dodying/bf3063d4e1f5b206018bfa19127669e9
export function getFavIconFromDomain(url) {
	if (!checkIfIsValidDomainName(url)) return "";
	const hostname = encodeURIComponent(extractDomain(url));

	return `https://icons.duckduckgo.com/ip2/${hostname}.ico`;
}

export function checkIfIsValidDomainName(str = "") {
	const regex =
		/(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]/i;
	return regex.test(str);
}

export function extractDomain(str) {
	try {
		if (!str) return "";
		const url = new URL(getValidUrl(str));
		return url.hostname.replace("www.", "");
	} catch (error) {
		return "";
	}
}

function getValidUrl(url = "") {
	let newUrl = window.decodeURIComponent(url);
	newUrl = newUrl.trim().replace(/\s/g, "");

	if (/^(:\/\/)/.test(newUrl)) return `http${newUrl}`;
	if (!/^(f|ht)tps?:\/\//i.test(newUrl)) return `http://${newUrl}`;

	return newUrl;
}

export function parseUrl(myUrl) {
	const urlObject = new URL(myUrl);
	urlObject.domain = urlObject.hostname.replace(/^[^.]+\./g, "");
	return urlObject;
}

/**
 * @description Validate email
 * @param {String} input  email address to validate
 * @returns {Boolean} true if email valid
 */
export function isValidEmail(input = "") {
	if (!input) return false;
	const regex =
		/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i;
	return regex.test(input);
}

/**
 * @description Validate LinkedIn profile url
 * @param {String} linkedinprofileurl 
 * @returns {Boolean} true if url is valid
 */
export function isValidLinkedInProfileUrl(linkedinprofileurl = "") {
	if (!linkedinprofileurl) return false;
	// const regex =
	// 	/((https?:\/\/)?((www|\w\w)\.)?linkedin\.com\/)((([\w]{2,3})?)|([^\/]+\/(([\w|\d-&#?=])+\/?){1,}))$/gm;

	const regex = /^(http(s)?:\/\/)?([\w]+\.)?linkedin\.com\/(in|profile)/gm
	return regex.test(linkedinprofileurl);
}
