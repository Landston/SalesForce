import { LightningElement, api, track } from "lwc";
import { updateRecord } from "lightning/uiRecordApi";
import checkCountryPickListActivation from "@salesforce/apex/Utill.checkCountryPickListActivation";
import { toast, errorToast } from "c/pipelaunchLiteUtils";

import labels from "./labels";

export default class PipelaunchLiteModalUpdateRecord extends LightningElement {
	@api modalHeader = "Update Record";
	@api sourceText = "PipeLaunch suggestions";
	@api labelWidth = 85;
	@track status = {
		isLoading: false,
		showModal: false,
		showCompareHeaderTitle: true,
	};
	@track fieldsData = false;

	labels = labels;

	@api
	updateRecord(fieldsData, customFieldMapping) {
		// console.log(fieldsData);
		this.fieldsData = fieldsData;
		this.status.showCompareHeaderTitle = !isOnlyDescriptionType(fieldsData.fields);
		this.status.showModal = true;
	}

	handleCloseModal() {
		// this.dispatchEvent(new CustomEvent("closemodal"));
		this.status.showModal = false;
	}

	async handleClickSave() {
		let fields = this._getFieldsData();

		this.status.isLoading = true;

		if( await checkCountryPickListActivation()){
			fields.BillingCountryCode = this.getCountryCode(fields.BillingCountry);
			
			delete fields.BillingCountry;
		}

		if (Object.keys(fields).length < 1) {
			this.status.isLoading = false;
			this.status.showModal = false;
			return;
		}

		try {
			await updateRecord({ fields });

			toast({ title: "Record updated with success", variant: "success" });

			this.dispatchEvent(new CustomEvent("recordupdated"));

			this.status.isLoading = false;
			this.status.showModal = false;
		} catch (error) {
			this.status.isLoading = false;
			console.error(error);
			errorToast({ title: "Cannot update the record data", error });
		}
	}

	_getFieldsData() {
		const compareRecordElements = this.template.querySelectorAll("c-pipelaunch-lite-compare-record-values");
		
		if (!compareRecordElements || compareRecordElements.length === 0) return;

		const fields = {
			Id: this.fieldsData.Id,
		};

		[...compareRecordElements].forEach(element => {
			const fieldValue = element.getFieldValue();
			if (fieldValue) fields[fieldValue.apiName] = fieldValue.value;

		});

		return fields;
	}

	getCountryCode(countryName){
		const countyToLower = countryName.toLowerCase();
		
		const ISOCode = TLD.find(value=> value.country === countyToLower);
		
		if (!ISOCode){
		 	toast({ title: "Wrong country code", variant: "error" });
			
			throw new Error();
		}

		return ISOCode.tld;
	}
}


function isOnlyDescriptionType(array) {
	return array.every(item => item.mode === "description");
}

const TLD = [
	{ tld: "al", country: "albania" },
	{ tld: "ad", country: "andorra" },
	{ tld: "am", country: "armenia" },
	{ tld: "at", country: "austria" },
	{ tld: "az", country: "azerbaijan" },
	{ tld: "by", country: "belarus" },
	{ tld: "be", country: "belgium" },
	{ tld: "ba", country: "bosnia and herzegovina" },
	{ tld: "bg", country: "bulgaria" },
	{ tld: "hr", country: "croatia" },
	{ tld: "cy", country: "cyprus" },
	{ tld: "cz", country: "czech republic" },
	{ tld: "dk", country: "denmark" },
	{ tld: "gb", country: "england" },
	{ tld: "ee", country: "estonia" },
	{ tld: "fo", country: "faroe islands" },
	{ tld: "fi", country: "finland" },
	{ tld: "fr", country: "france" },
	{ tld: "ge", country: "georgia" },
	{ tld: "de", country: "germany" },
	{ tld: "gi", country: "gibraltar" },
	{ tld: "gr", country: "greece" },
	{ tld: "gl", country: "greenland" },
	{ tld: "hu", country: "hungary" },
	{ tld: "is", country: "iceland" },
	{ tld: "ie", country: "ireland" },
	{ tld: "it", country: "italy" },
	{ tld: "kz", country: "kazakhstan" },
	{ tld: "xk", country: "kosovo" },
	{ tld: "kg", country: "kyrgyzstan" },
	{ tld: "lv", country: "latvia" },
	{ tld: "li", country: "liechtenstein" },
	{ tld: "lt", country: "lithuania" },
	{ tld: "lu", country: "luxembourg" },
	{ tld: "mk", country: "macedonia" },
	{ tld: "mt", country: "malta" },
	{ tld: "md", country: "moldova" },
	{ tld: "mc", country: "monaco" },
	{ tld: "me", country: "montenegro" },
	{ tld: "nl", country: "netherlands" },
	{ tld: "gb", country: "northern ireland" },
	{ tld: "no", country: "norway" },
	{ tld: "pl", country: "poland" },
	{ tld: "pt", country: "portugal" },
	{ tld: "ro", country: "romania" },
	{ tld: "ru", country: "russian federation" },
	{ tld: "sm", country: "san marino" },
	{ tld: "gb", country: "scotland" },
	{ tld: "rs", country: "serbia" },
	{ tld: "sk", country: "slovakia" },
	{ tld: "si", country: "slovenia" },
	{ tld: "es", country: "spain" },
	{ tld: "se", country: "sweden" },
	{ tld: "ch", country: "switzerland" },
	{ tld: "tj", country: "tajikistan" },
	{ tld: "tr", country: "turkey" },
	{ tld: "tm", country: "turkmenistan" },
	{ tld: "ua", country: "ukraine" },
	{ tld: "uz", country: "uzbekistan" },
	{ tld: "gb", country: "wales" }
  ];
  