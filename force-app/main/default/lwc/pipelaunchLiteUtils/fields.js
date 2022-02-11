export function extractCompanyName(recordData) {
  if (
    !recordData ||
    !Object.prototype.hasOwnProperty.call(recordData, "apiName")
  ) {
    throw new Error("Invalid recordData received");
  }

  const apiName = recordData.apiName;

  if (apiName === "Account") {
    if (
      !Object.prototype.hasOwnProperty.call(recordData, "fields") ||
      !Object.prototype.hasOwnProperty.call(recordData.fields, "Name") ||
      !Object.prototype.hasOwnProperty.call(recordData.fields.Name, "value")
    ) {
      throw new Error("No account name"); // account name is a mandatory field
    }

    return recordData.fields.Name.value;
  }

  if (apiName === "Contact" || apiName === "Opportunity") {
    if (
      !Object.prototype.hasOwnProperty.call(recordData, "fields") ||
      !Object.prototype.hasOwnProperty.call(recordData.fields, "Account") ||
      !Object.prototype.hasOwnProperty.call(
        recordData.fields.Account,
        "displayValue"
      ) ||
      !recordData.fields.Account.displayValue ||
      recordData.fields.Account.displayValue.trim().length === 0
    ) {
      throw new Error("No associated account");
    }

    return recordData.fields.Account.displayValue.trim();
  }

  if (apiName === "Lead") {
    if (
      !Object.prototype.hasOwnProperty.call(recordData, "fields") ||
      !Object.prototype.hasOwnProperty.call(recordData.fields, "Company") ||
      !Object.prototype.hasOwnProperty.call(
        recordData.fields.Company,
        "value"
      ) ||
      !recordData.fields.Company.value ||
      recordData.fields.Company.value.trim().length === 0
    ) {
      throw new Error("Lead without company name");
    }

    return recordData.fields.Company.value.trim();
  }

  throw new Error("Invalid processing");
}

export function extractGenericField(recordData, field) {
  if (
    !recordData ||
    !Object.prototype.hasOwnProperty.call(recordData, "apiName")
  ) {
    throw new Error("Invalid recordData received");
  }

  return recordData.fields[field]?.value ?? null;
}

export function extractDescriptionOrWebsite(recordData, field = "Description") {
  if (
    !recordData ||
    !Object.prototype.hasOwnProperty.call(recordData, "apiName")
  ) {
    throw new Error("Invalid recordData received");
  }

  const apiName = recordData.apiName;

  if (apiName === "Account") {
    return recordData.fields[field]?.value ?? null;
  }

  if (apiName === "Contact" || apiName === "Opportunity") {
    return (
      recordData.fields?.Account?.value?.fields[field]?.value?.trim() ?? null
    );
  }

  if (apiName === "Lead") {
    return recordData.fields[field]?.value?.trim() ?? null;
  }

  throw new Error("Invalid processing");
}

/**
 * @description Gets the fields that represent the company name for a specific
 * salesforce sObject
 * @param {String} objectName sObject Name: Contact, Account, Lead or Opportunity
 * @returns {String[]} Fields
 */
export function generateFieldsBasedOnObject(objectName) {
  if (objectName === "Lead") return ["Lead.Company"];
  if (objectName === "Contact") return ["Contact.Account.Name"];
  if (objectName === "Account") return ["Account.Name"];
  if (objectName === "Opportunity") return ["Opportunity.Account.Name"];
  return null; // should not happen
}

export function generateContactFieldsBasedOnObject(objectName) {
  if (objectName === "Lead")
    return [
      "Lead.FirstName",
      "Lead.LastName",
      "Lead.Salutation",
      "Lead.Title",
      "Lead.Phone",
      "Lead.MobilePhone",
      "Lead.Company"
    ];
  if (objectName === "Contact")
    return [
      "Contact.FirstName",
      "Contact.LastName",
      "Contact.Salutation",
      "Contact.Title",
      "Contact.Phone",
      "Contact.MobilePhone",
      "Contact.Account.Name"
    ];
  if (objectName === "Account") return ["Account.Name", "Account.Phone"];

  return null;
}


export function extractContactAccountField(recordData, fieldName = "AnnualRevenue") {
  if (
    !recordData ||
    !Object.prototype.hasOwnProperty.call(recordData, "apiName")
  ) {
    throw new Error("Invalid recordData received");
  }

  if (recordData.apiName !== "Contact") return false;

  return recordData.fields?.Account?.value?.fields[fieldName]?.value ?? false;
}

export function extractAccountId(recordData) {
  if (
    !recordData ||
    !Object.prototype.hasOwnProperty.call(recordData, "apiName")
  ) {
    throw new Error("Invalid recordData received");
  }

  const apiName = recordData.apiName;

  if (apiName === "Account") {
    return recordData.id;
  }

  if (apiName === "Contact" || apiName === "Opportunity") {
    if (
      !Object.prototype.hasOwnProperty.call(recordData, "fields") ||
      !Object.prototype.hasOwnProperty.call(recordData.fields, "Account") ||
      !Object.prototype.hasOwnProperty.call(recordData.fields.Account, "value") ||
      !Object.prototype.hasOwnProperty.call(recordData.fields.Account.value, "id") ||
      !recordData.fields.Account.value.id ||
      recordData.fields.Account.value.id.trim().length === 0
    ) {
      throw new Error("No associated account");
    }

    return recordData.fields.Account.value.id.trim();
  }

  if (apiName === "Lead") {
    return null;
  }

  throw new Error("Cannot extract the Account Id of the record");
}