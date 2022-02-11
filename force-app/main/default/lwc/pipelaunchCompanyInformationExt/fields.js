import apex_getCustomFieldMapping from "@salesforce/apex/CustomSettingsController.getCustomFieldMapping";

const SUPPORTED_OBJECT_NAMES = ["Account", "Contact", "Lead", "Opportunity"];

const GENERIC_FIELDS = [
	"Website",
	"NumberOfEmployees",
	"AnnualRevenue",
	"Industry",
	"HitHorizonsID",
	"YearStarted",
	"Sic",
	"Street",
	"City",
	"PostalCode",
	"State",
	"Country",
	"CountryCode"
];
const LEAD_FIELDS = ["CompanyDunsNumber"];
const ACCOUNT_FIELDS = ["DunsNumber"];

/**
 * @description Generates salesforce fields based on the object name. This is needed since the field names can
 * change between objects. Eg. Account name is company on Lead sObject
 * @param {String} objectName
 * @param {Object} fieldMapping
 * @returns {String[]} Array of field names
 */
export function generateFieldMapping(objectName, fieldMapping) {
	const objectPrefix =
		objectName === "Contact" || objectName === "Opportunity"
			? `${objectName}.Account`
			: objectName;
	const fieldsToProcess =
		objectName === "Lead"
			? [...GENERIC_FIELDS, ...LEAD_FIELDS]
			: [...GENERIC_FIELDS, ...ACCOUNT_FIELDS];

	let fields = [];
	fieldsToProcess.forEach((field) => {
		if (
			Object.prototype.hasOwnProperty.call(fieldMapping, field) &&
			fieldMapping[field]
		)
			fields.push(`${objectPrefix}.${fieldMapping[field]}`);
	});
	fields.push(
		`${objectPrefix}.${objectName === "Lead" ? "Company" : "Name"}`
	);

	return Object.freeze(fields);
}

export async function getCustomFieldMappingBasedOnObject(objectName = "") {
	if (!objectName || !SUPPORTED_OBJECT_NAMES.includes(objectName))
		throw new TypeError("Enter a valid objectName");

	return await apex_getCustomFieldMapping();
}
