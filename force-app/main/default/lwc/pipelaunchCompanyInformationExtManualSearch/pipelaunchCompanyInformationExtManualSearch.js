import { LightningElement, api, track } from "lwc";

export default class PipelaunchCompanyInformationExtManualSearch extends LightningElement {
	@track status = {
		showAdvancedFilters: false
	};

	@track _details = {
		CompanyName: "",
		AddressUnstructured: "",
		TaxNumber: "",
		DUNSNumber: "",
		ShowBranches: false,
	};

	@api
	get details(){
		return this._details;
	}
	set details(value){
		this._details = {...value};
	}

	get computeHasInvalidValues() {
		const hasEmptyFields = !Object.keys(this._details).some(
			(key) => this._details[key] && this._details[key] !== ""
		);
		if (hasEmptyFields) return true;
		if (
			this._details.companyName &&
			this._details.companyName.trim().length < 3
		)
			return true;
		return false;
	}

	handleClickButtonAdvancedFilters() {
		this.status.showAdvancedFilters = !this.status.showAdvancedFilters;
	}

	handleClickButtonClearSearch() {
		Object.keys(this._details).forEach((key) => {
			if (key !== "ShowBranches") this._details[key] = "";
		});
	}

	handleClickButtonSearch() {
		const ShowBranches = this.status.showAdvancedFilters
			? this.template.querySelector(
					'lightning-input[data-field="showBranches"]'
			  ).checked
			: false;
		const detail = Object.freeze({
			CompanyName: this._details.CompanyName.trim(),
			AddressUnstructured: this._details.AddressUnstructured.trim(),
			TaxNumber: this.status.showAdvancedFilters
				? this._details.TaxNumber.trim()
				: "",
			DUNSNumber: this.status.showAdvancedFilters
				? this._details.DUNSNumber.trim()
				: "",
			ShowBranches,
		});
		this.dispatchEvent(new CustomEvent("searchchange", { detail }));
	}

	handleInputChange(evt) {
		const field = evt.target.dataset.field;
		this._details[field] = evt.target.value;
	}

	handleKeyUp(evt){
		const field = evt.target.dataset.field;
		this._details[field] = evt.target.value;

		if (evt.key === "Enter" && !this.computeHasInvalidValues) {
			this.handleClickButtonSearch();
		}
	}
}

// [...this.template.querySelectorAll('*[data-selector="input-text"]')].forEach(element => {
// 	element.value = "";
// });
