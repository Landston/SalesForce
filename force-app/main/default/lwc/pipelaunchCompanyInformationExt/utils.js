import {
	extractCompanyName,
	extractGenericField,
	extractAccountId
} from "c/pipelaunchLiteUtils";

/**
 * @description get hithorizons id
 * @param {Object} recordData
 * @returns {String}
 */
export function getHitHorizonsId(recordData, fieldName) {
	if (
		!recordData ||
		!Object.prototype.hasOwnProperty.call(recordData, "apiName") ||
		!Object.prototype.hasOwnProperty.call(recordData, "fields")
	)
		throw new TypeError("Invalid Record Data");

	if (
		recordData.apiName === "Contact" ||
		recordData.apiName === "Opportunity"
	) {
		if (
			!Object.prototype.hasOwnProperty.call(
				recordData.fields,
				"Account"
			) ||
			!Object.prototype.hasOwnProperty.call(
				recordData.fields.Account,
				"displayValue"
			)
		)
			throw new TypeError("No account associated with this record");

		return recordData.fields.Account.value.fields &&
			Object.prototype.hasOwnProperty.call(
				recordData.fields.Account.value.fields,
				fieldName
			) &&
			Object.prototype.hasOwnProperty.call(
				recordData.fields.Account.value.fields[fieldName],
				"value"
			) &&
			recordData.fields.Account.value.fields[fieldName].value !== null &&
			recordData.fields.Account.value.fields[fieldName].value.trim()
				.length === 14
			? recordData.fields.Account.value.fields[fieldName].value
			: null;
	}

	return Object.prototype.hasOwnProperty.call(recordData.fields, fieldName) &&
		Object.prototype.hasOwnProperty.call(
			recordData.fields[fieldName],
			"value"
		) &&
		recordData.fields[fieldName].value !== null &&
		recordData.fields[fieldName].value.trim().length === 14
		? recordData.fields[fieldName].value
		: null;
}

export function parseRecordData(recordData, customFieldMapping) {
	if (!customFieldMapping)
		throw new Error("Invalid customFieldMapping received");
	const Name = extractCompanyName(recordData);
	const NumberOfEmployees = extractGenericField(
		recordData,
		customFieldMapping.NumberOfEmployees
	);
	const AnnualRevenue = extractGenericField(
		recordData,
		customFieldMapping.AnnualRevenue
	);
	const DunsNumber = extractGenericField(
		recordData,
		customFieldMapping.DunsNumber
	);
	const Sic = extractGenericField(recordData, customFieldMapping.Sic);
	const Website = extractGenericField(recordData, customFieldMapping.Website);
	const Street = extractGenericField(recordData, customFieldMapping.Street);
	const City = extractGenericField(recordData, customFieldMapping.City);
	const Country = extractGenericField(recordData, customFieldMapping.Country);
	const PostalCode = extractGenericField(
		recordData,
		customFieldMapping.PostalCode
	);
	const State = extractGenericField(recordData, customFieldMapping.State);
	const HitHorizonsId = getHitHorizonsId(
		recordData,
		customFieldMapping.HitHorizonsID
	);

	return {
		Name,
		Website,
		NumberOfEmployees,
		AnnualRevenue,
		DunsNumber,
		Sic,
		Street,
		City,
		Country,
		PostalCode,
		State,
		HitHorizonsId
	};
}

// TODO dynamic code
const BASE_FIELD_MAPPING = [
	{
		label: "Company Name",
		apiName: "Name",
		mode: "text"
	}
];

export function generateUpdateFields(recordData, apiData, customFieldMapping) {
	const processedData = parseRecordData(recordData, customFieldMapping);
	const fields = [];

	if (apiData.CompanyName && processedData.Name !== apiData.CompanyName) {
		fields.push({
			label: "Company Name",
			apiName: "Name",
			mode: "text",
			originalValue: processedData.Name,
			newValue: apiData.CompanyName
		});
	}

	if (
		apiData.Website &&
		processedData.Website !== apiData.Website &&
		customFieldMapping.Website
	) {
		fields.push({
			label: "Website",
			apiName: customFieldMapping.Website,
			mode: "link",
			originalValue: processedData.Website,
			newValue: apiData.Website
		});
	}

	// todo: eur/usd
	if (
		apiData.SalesEUR &&
		processedData.AnnualRevenue !== apiData.SalesEUR &&
		customFieldMapping.AnnualRevenue
	) {
		fields.push({
			label: "Annual Revenue",
			apiName: customFieldMapping.AnnualRevenue,
			mode: "currency",
			originalValue: processedData.AnnualRevenue,
			newValue: apiData.SalesEUR
		});
	}
	if (
		apiData.AddressStreetLine1 &&
		processedData.Street !== apiData.AddressStreetLine1 &&
		customFieldMapping.Street
	) {
		fields.push({
			label: "Street",
			apiName: customFieldMapping.Street,
			mode: "text",
			originalValue: processedData.Street,
			newValue: apiData.AddressStreetLine1
		});
	}

	if (
		apiData.City &&
		processedData.City !== apiData.City &&
		customFieldMapping.City
	) {
		fields.push({
			label: "City",
			apiName: customFieldMapping.City,
			mode: "text",
			originalValue: processedData.City,
			newValue: apiData.City
		});
	}

	if (
		apiData.Country &&
		processedData.Country !== apiData.Country &&
		customFieldMapping.Country
	) {
		fields.push({
			label: "Country",
			apiName: customFieldMapping.Country,
			mode: "text",
			originalValue: processedData.Country,
			newValue: apiData.Country
		});
	}

	if (
		apiData.PostalCode &&
		processedData.PostalCode !== apiData.PostalCode &&
		customFieldMapping.PostalCode
	) {
		fields.push({
			label: "Postal Code",
			apiName: customFieldMapping.PostalCode,
			mode: "text",
			originalValue: processedData.PostalCode,
			newValue: apiData.PostalCode
		});
	}

	// if (
	// 	apiData.StateProvince &&
	// 	processedData.State !== apiData.StateProvince &&
	// 	customFieldMapping.State
	// ) {
	// 	fields.push({
	// 		label: "State",
	// 		apiName: customFieldMapping.State,
	// 		mode: "text",
	// 		originalValue: processedData.State,
	// 		newValue: apiData.StateProvince
	// 	});
	// }

	if (
		apiData.HitHorizonsId &&
		processedData.HitHorizonsId !== apiData.HitHorizonsId &&
		customFieldMapping.HitHorizonsID
	) {
		fields.push({
			label: "HitHorizons ID",
			apiName: customFieldMapping.HitHorizonsID,
			mode: "text",
			originalValue: processedData.HitHorizonsId,
			newValue: apiData.HitHorizonsId
		});
	}

	return fields;
}

// function checkIfIsDifferent(input, apiData, field = "", apiName = "", mode = "text") {
//   if (!input) return
// lower case
// }

export function processAndValidateSearchResults(result) {
	const apiData = validateAndParseApexResult(result);
	if (
		!apiData ||
		!Object.prototype.hasOwnProperty.call(apiData, "items") ||
		!Object.prototype.hasOwnProperty.call(apiData.items, "Result") ||
		!Object.prototype.hasOwnProperty.call(
			apiData.items.Result,
			"Results"
		) ||
		(Array.isArray(apiData.items.Result.Results) &&
			apiData.items.Result.Results.length === 0)
	) {
		return null;
	}

	return apiData.items.Result.Results;
}

/**
 *
 * @param {*} result
 * @returns {Boolean} false if not licensed
 */
export function checkIfIsLicensed(result) {
	return result &&
		Object.prototype.hasOwnProperty.call(result, "Error") &&
		result.Error === "HITHORIZONS_UNLICENSED"
		? false
		: true;
}

export function processAndValidateCompanyResults(result) {
	const apiData = validateAndParseApexResult(result);

	if (
		!apiData ||
		!Object.prototype.hasOwnProperty.call(apiData, "items") ||
		!Object.prototype.hasOwnProperty.call(apiData.items, "Result") ||
		!Object.prototype.hasOwnProperty.call(
			apiData.items.Result,
			"HitHorizonsId"
		)
	) {
		// TODO: deal with that
		throw new Error("Invalid data received from the API");
	}

	return apiData.items.Result;
}

function validateAndParseApexResult(result) {
	if (!result || Object.keys(result).length === 0)
		throw new Error("No data received");
	if (Object.prototype.hasOwnProperty.call(result, "Error") && result.Error) {
		const errorMessage = Object.prototype.hasOwnProperty.call(
			result,
			"ErrorMessage"
		)
			? result.ErrorMessage
			: "Unknown error";
		throw new Error(errorMessage);
	}

	return JSON.parse(result.Results) || [];
}

export function getAccountFieldValue(recordData, fieldName) {
	if (!recordData || !fieldName) return null;
	return recordData &&
		Object.prototype.hasOwnProperty.call(recordData, "fields") &&
		Object.prototype.hasOwnProperty.call(recordData.fields, fieldName) &&
		Object.prototype.hasOwnProperty.call(
			recordData.fields[fieldName],
			"value"
		) &&
		recordData.fields[fieldName].value !== null
		? recordData.fields[fieldName].value
		: null;
}

/**
 * @description	extracts the Id of the account (related) or lead
 * this is an extension of the utils extractAccountId because it returns
 * null for the lead object
 * @param {Object} recordData
 * @returns {String} id
 */
export function extractAccountOrLeadId(recordData) {
	const extractedId = extractAccountId(recordData);
	if (extractedId === null && recordData.apiName === "Lead") {
		return recordData.id;
	}
	return extractedId;
}

export function checkIfIsPipeLaunchUnlicensed(response) {
	return (
		response &&
		Object.prototype.hasOwnProperty.call(response, "Error") &&
		response.Error === "UNLICENSED"
	);
}

export function selectCustomFieldMappingObject(response, objectName) {
	const _objectName =
		objectName === "Contact" || objectName === "Opportunity"
			? "Account"
			: objectName;

	if (
		!response ||
		!Object.prototype.hasOwnProperty.call(response, "Results") ||
		!Object.prototype.hasOwnProperty.call(response.Results, _objectName)
	)
		throw new Error(
			"Response doesn't has field mapping for the current Object"
		);

	return response.Results[_objectName];
}


export function resetSearchResults() {
	return {
		total: 0,
		items: [],
		displayItems: [],
	};
}