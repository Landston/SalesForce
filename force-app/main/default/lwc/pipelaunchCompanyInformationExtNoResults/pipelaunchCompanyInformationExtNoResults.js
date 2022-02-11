import { LightningElement, api } from "lwc";

import { templateStringReplacement } from "c/pipelaunchLiteUtils";

import labels from "./labels";

export default class PipelaunchCompanyInformationExtNoResults extends LightningElement {
	@api companyName = "";

	labels = labels;

	/**
	 * @type {String}
	 */
	get computeHeaderText() {
		if (!this.companyName)
			return "Trouble finding the right company? Where's some tips";
			
		const processedString = templateStringReplacement(
			{ COMPANY_NAME: this.companyName },
			this.labels.TROUBLE_FINDIND_X_SOME_TIPS
		);
		return processedString;
	}

	handleClickManualSearchButton() {
		this.dispatchEvent(new CustomEvent("manualsearch"));
	}
}
