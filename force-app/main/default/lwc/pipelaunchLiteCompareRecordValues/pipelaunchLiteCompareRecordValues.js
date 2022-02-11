import { LightningElement, api } from "lwc";

import labels from "./labels";

const VALID_OPTIONS = ["text", "avatar", "description", "link", "currency"];

export default class PipelaunchLiteCompareRecordValues extends LightningElement {
	@api label = "";
	@api apiName = "";
	@api labelWidth = false; // specify a width in pixels
	@api mode = "text"; // text, avatar, description, link
	@api originalValue = "";
	@api newValue = "";
	@api hideEqualValues = false;

	labels = labels;
	showComponent = true;
	originalChecked = true;
	newChecked = false;
	radioDescriptionValue = "keep";

	get isText() {
		return (
			!this.mode ||
			this.mode === "text" ||
			!VALID_OPTIONS.includes(this.mode)
		);
	}

	get isAvatar() {
		return this.mode === "avatar";
	}

	get isDescription() {
		return this.mode === "description";
	}

	get isLink() {
		return this.mode === "link";
	}

	get isCurrency() {
		return this.mode === "currency";
	}

	get computeLabelStyle() {
		if (
			this.labelWidth &&
			!isNaN(this.labelWidth) &&
			this.labelWidth > 10
		) {
			return `min-width: ${this.labelWidth}px;`;
		}
		return "";
	}

	get computeName() {
		return `picker-${encodeURIComponent(this.label)}`; // to generate unique names for radio buttons
	}

	get radioDescriptionOptions() {
		if (this.originalValue) {
			return [
				{ label: this.labels.KEEP_EXISTING, value: "keep" },
				{ label: this.labels.ADD_TO_EXISTING, value: "add" },
				{ label: this.labels.REPLACE_EXISTING, value: "replace" }
			];
		}

		return [
			{ label: this.labels.KEEP_EXISTING, value: "keep" },
			{ label: this.labels.REPLACE_EXISTING, value: "replace" }
		];
	}

	get isKeepExisting() {
		return this.radioDescriptionValue === "keep";
	}

	get isAddToExisting() {
		return this.radioDescriptionValue === "add";
	}

	get isReplaceExisting() {
		return this.radioDescriptionValue === "replace";
	}

	get computeLabelClasses() {
		if (this.isDescription) {
			return "slds-var-p-right_x-small slds-var-p-top_xx-small";
		}
		return "slds-var-p-right_x-small slds-align-middle";
	}

	get computeAppendDescriptionValue() {
		return this.originalValue + "\r\n" + this.newValue;
	}

	connectedCallback() {
		if (!this.apiName) {
			throw new Error("apiName is required");
		}
		this._checkValues();
	}

	/**
	 * @description  	Gets the radio button value (DEPRECATED)
	 * @returns {String} one of the following values: "keep", "add", "replace", "original", "new"
	 */
	@api value() {
		if (this.isDescription) {
			return this.radioDescriptionValue;
		}
		return this.originalChecked ? "original" : "new";
	}

	@api
	getFieldValue() {
		if (this.isDescription) {
			switch (this.radioDescriptionValue) {
				case "replace":
					return {
						apiName: this.apiName,
						value: this.newValue
					};
				case "add":
					return {
						apiName: this.apiName,
						value: this._appendDescriptionText()
					};
				default:
					// keep
					return null;
			}
		}

		const value = this.template.querySelector(
			`input[name="${this.computeName}"]:checked`
		).value; // original or new

		if (this.originalValue === this.newValue || value === "original")
			return null; // equal or keep original

		return {
			apiName: this.apiName,
			value: this.newValue
		};
	}

	handleChangeNewRadio(event) {
		this.newChecked = event.target.checked;
		this.newChecked = event.target.checked;
	}

	handleChangeRadioDescription(event) {
		const selectedOption = event.detail.value;
		this.radioDescriptionValue = selectedOption;
	}

	handleDescriptionChange(event) {
		this.newValue = event.target.value;
	}

	_appendDescriptionText() {
		return this.originalValue + "\n\r------------\n\r" + this.newValue;
	}

	_checkValues() {
		if (this.hideEqualValues && this.originalValue === this.newValue) {
			this.showComponent = false;
			return;
		}

		if (!this.originalValue && this.newValue) {
			this.newChecked = true;
			this.originalChecked = false;
			this.radioDescriptionValue = "replace";
		} else if (this.originalValue && !this.newValue) {
			this.originalChecked = true;
			this.newChecked = false;
			this.radioDescriptionValue = "keep";
		}
	}
}
