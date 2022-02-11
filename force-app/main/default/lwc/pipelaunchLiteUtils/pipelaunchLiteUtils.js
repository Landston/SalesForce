export {
	reduceErrorsString,
	reduceErrors,
	generateToastErrorMessageContent,
	getErrorExceptionType
} from "./errors";
export { toast, errorToast } from "./toast";
export {
	extractCompanyName,
	extractDescriptionOrWebsite,
	generateFieldsBasedOnObject,
	generateContactFieldsBasedOnObject,
	extractContactAccountField,
	extractGenericField,
	extractAccountId
} from "./fields";
export {
	boldKeywords,
	stripTags,
	truncate,
	unescapeHtmlLabels,
	htmlDecode,
	validateInputString,
	templateStringReplacement
} from "./strings";
export {
	disableElementTemporary,
	validateRecordIdObjectApiName,
	wait
} from "./misc";
export {
	checkIfIsValidDomainName,
	extractDomain,
	makeAbsoluteUrl,
	extractLinkedInCompanyUrlPart,
	removeHttpFromUrl,
	parseUrl,
	getFavIconFromDomain,
	isValidEmail,
	isValidLinkedInProfileUrl,
	extractLinkedInProfileName
} from "./urls";
export { guid } from "./guid";
