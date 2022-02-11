import { LightningElement, api } from "lwc";

import employeesRange from "./employeesRange";
import getIndustryClassificationLabel from "./industryClassificationCodeList";
import displayInEuros from "./currency";

export default class PipelaunchCompanyInformationExtData extends LightningElement {
	@api details = null;
	@api settings = { showMap: false, showExactFigures: false };
	@api flexipageRegionWidth;

	_displayInEuros = displayInEuros();

	get computeStreetAddress() {
		if (!this.details) return "";
		return `${this.details.AddressStreetLine1} ${this.details.AddressStreetLine2}`;
	}

	get computeNumberOfEmployeesRange() {
		return employeesRange(this.details.EmployeesNumber);
	}

	get computeIndustryClassificationLabel() {
		return getIndustryClassificationLabel(this.details.Industry);
	}

	get computeFormClasses() {
		return this.flexipageRegionWidth === "SMALL"
			? "slds-form-element_horizontal narrow-form no-padding-left"
			: "slds-form-element_horizontal auto-column";
	}

	get computeLabelClasses() {
		return this.flexipageRegionWidth === "SMALL"
			? "slds-form-element__label narrow-label"
			: "slds-form-element__label auto-column";
	}
}
