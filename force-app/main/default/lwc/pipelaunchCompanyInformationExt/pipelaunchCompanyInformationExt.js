/**
 * @description       : PipeLaunch Company Information Extended (uses HitHorizons integration)
 * @group             : PipeLaunch Lite Components
 * @last modified on  : 02-08-2022
 * @last modified by  : scarreira@ibs-technology.com
**/
import { LightningElement, api, track, wire } from "lwc";

import { getRecord } from "lightning/uiRecordApi";

import apex_searchCompany from "@salesforce/apex/PipelaunchCompanyInfoExtController.searchCompany";
import apex_getCompany from "@salesforce/apex/PipelaunchCompanyInfoExtController.getCompany";

import {
	extractCompanyName,
	disableElementTemporary,
	validateRecordIdObjectApiName,
	templateStringReplacement,
	wait
} from "c/pipelaunchLiteUtils";

// import { SEARCH, RESULT } from "./fakedata";

import {
	MAX_RESULTS_SEARCH,
	MAX_RESULTS_STRICT_SEARCH,
	PAGINATION_LIMIT
} from "./config";
import labels from "./labels";
import {
	generateFieldMapping,
	getCustomFieldMappingBasedOnObject
} from "./fields";
import { updateHitHorizonsId } from "./updateRecord";
import * as utils from "./utils";
import * as settingsManager from "./settings";

export default class PipelaunchCompanyInformationExt extends LightningElement {
	@api debug = false;
	@api recordId;
	@api objectApiName;
	@api flexipageRegionWidth;
	@api hideCardTitle = false;

	@track status = {
		isLoading: true,
		errors: undefined,
		errorType: "",
		searchCompanyName: "",
		showButtonMoreResults: false,
		showSaveBanner: false,
		showMatchBanner: false,
		isFirstSearch: true, // true to use strict search mode (with quotes), that is the default method, we only do the second search if the first one doen't return any results
		isManualSearch: false
	};
	@track view = {
		searchCompany: false,
		companyInfo: false,
		notFoundMessage: false,
		manualSearch: false,
		notLicensed: false
	};
	@track settings = settingsManager.DEFAULT_SETTINGS;

	@track searchResults = {
		total: 0,
		items: [], // original data
		displayItems: [] // paginated displayed data
	};
	@track companyInformation = null; // company information payload

	_recordData = null;
	labels = labels;
	fields = null;
	customFieldMapping = {};
	manualSearchPayload = {
		CompanyName: "",
		AddressUnstructured: "",
		TaxNumber: "",
		DUNSNumber: "",
		ShowBranches: false,
	};

	_getRecordDataResponse;
	@wire(getRecord, { recordId: "$recordId", fields: "$fields" })
	async getRecordDataResponse(response) {
		try {
			this._getRecordDataResponse = response;
			if (response.data) {
				if (this.debug) console.info("Record data", response.data);
				this._recordData = response.data;
				await this._searchOrGetData();
			} else if (response.error) {
				console.error("Error getting record data", response.error);
				this.status.isLoading = false;
				this.status.errors = response.error;
			}
		} catch (e) {
			console.error(e);
			this.status.isLoading = false;
			this.status.errors = e;
		}
	}

	connectedCallback() {
		this.settings = settingsManager.loadSettings();
		this._checkRecordIdAndFields();
	}

	get computeSearchingLabel() {
		try {
			if (this.status.isManualSearch)
				return "It shouldn’t take much longer. We are only searching a database of 76 million companies...";
			if (!this._recordData) return this.labels.GETTING_RECORD_DATA;
			const companyName = extractCompanyName(this._recordData);
			const processedString = templateStringReplacement(
				{ COMPANY_NAME: companyName },
				this.labels.SEARCHING_FOR_COMPANY
			);
			return processedString;
		} catch (e) {
			console.error("Computing label", e);
			return;
		}
	}

	/**
	 * @type {String}
	 */
	get computeResumeSearchResultsLabel() {
		if (this.status.isManualSearch)
			return "Please select the right company";
		const companyName = extractCompanyName(this._recordData);
		return `Found ${this.searchResults.total} results for <strong>${companyName}</strong>, please select the right company`;
	}

	get computeShowMoreResults() {
		return (
			this.searchResults.displayItems.length <
			this.searchResults.items.length
		);
	}

	/**
	 * @type {Boolean} show not the right company button
	 */
	get computeShowButtonNotRightCompany() {
		return !this.status.isLoading && this.view.companyInfo; // and hithorizons id should not be match
	}

	get computeShowButtonBackManualSearch() {
		return (
			!this.status.isLoading &&
			this.view.manualSearch
		);
	}

	get computeShowButtonBackManualSearchLabel() {
		return this.searchResults.total > 0
			? "Back to search results"
			: "Back to company information";
	}

	handleClickButtonCancel() {
		if (this.searchResults.total > 0) {
			this._setView("searchCompany");
		} else {
			this._setView("companyInfo");
		}
	}


	/**
	 * @description can return to the search results or unmatch the company
	 */
	async handleClickButtonNotRightCompany() {
		const hitHorizonsId = utils.getHitHorizonsId(
			this._recordData,
			this.customFieldMapping.HitHorizonsID
		);

		this.status.showSaveBanner = false;

		if (hitHorizonsId) {
			await this._updateHitHorizonsId(null);
		}

		if (this.searchResults.items.length > 0) {
			this._setView("searchCompany");
		} else {
			this._setView("manualSearch");
		}
	}

	async handleClickButtonMatch() {
		this.status.showMatchBanner = false;
		await this._updateHitHorizonsId(this.companyInformation.HitHorizonsId);
		// it will refresh automatically due reactive properties
	}

	handleSearchChange(evt) {
		const detail = { ...evt.detail };
		detail.MaxResults = MAX_RESULTS_SEARCH;
		detail.strict = false;
		if (this.debug) console.info("Searching parameters", detail);
		this.status.isManualSearch = true;
		this.manualSearchPayload = detail;
		this._searchCompany(detail);
	}

	async handleCompanyClick(evt) {
		const companyId = evt.currentTarget.dataset.id;
		await this._getCompanyInformationById(companyId);
	}

	handleClickShowMoreResults() {
		this.searchResults.displayItems = this.searchResults.items.slice(
			0,
			this.searchResults.displayItems.length + PAGINATION_LIMIT
		);
	}

	handleMenuSelect(evt) {
		const selectedItemValue = evt.detail.value;
		if (selectedItemValue === "MenuItemAbout") {
			this.template.querySelector("c-pipelaunch-lite-modal-about").show();
		} else if (selectedItemValue === "MenuItemRefresh") {
			// this._checkRecordIdAndFields();
		} else if (selectedItemValue === "MenuItemManualSearch") {
			this._setView("manualSearch");
		} else if (selectedItemValue === "MenuItemShowMap") {
			this.settings.showMap = !this.settings.showMap;
			settingsManager.saveSettings(this.settings);
		} else if (selectedItemValue === "MenuItemShowExactFigures") {
			this.settings.showExactFigures = !this.settings.showExactFigures;
			settingsManager.saveSettings(this.settings);
		}
	}

	handleGoToManualSearch() {
		this._setView("manualSearch");
	}

	handleClickButtonUpdate(evt) {
		try {
			disableElementTemporary(evt.target);
			// this.status.showSaveBanner = false;

			const Id =
				this.objectApiName === "Contact"
					? this._recordData.fields.Account.value.id
					: this.recordId;

			const updateRecordPayload = {
				Id,
				fields: utils.generateUpdateFields(
					this._recordData,
					this.companyInformation,
					this.customFieldMapping
				),
			};

			if (this.debug)
				console.info("updateRecordPayload", updateRecordPayload);

			this.template
				.querySelector("c-pipelaunch-lite-modal-update-record")
				.updateRecord(updateRecordPayload, this.customFieldMapping);
		} catch (e) {
			console.error(e);
			this.status.isLoading = false;
			this.status.errors = e;
		}
	}

	async _updateHitHorizonsId(hitHorizonsId = null) {
		this.status.isLoading = true;
		await updateHitHorizonsId(
			this._recordData,
			this.customFieldMapping.HitHorizonsID,
			hitHorizonsId
		);
		this.status.isLoading = false;
	}

	_showUnlicensedMessage() {
		this._setView("notLicensed");
		this.status.isLoading = false;
	}

	_setView(name) {
		Object.keys(this.view).forEach((key) => {
			this.view[key] = key === name ? true : false;
		});
	}

	_setUnlicensedMode() {
		this.unlicensed = true;
		this.status.isLoading = false;
	}

	/**
	 * @description validate recordId parameter and generate field list
	 * to call the wire method to get the data
	 */
	async _checkRecordIdAndFields() {
		try {
			this.status.isLoading = true;
			validateRecordIdObjectApiName(this.recordId, this.objectApiName);
			const objectApiName = this.objectApiName.toString();
			const fieldMappingResponse =
				await getCustomFieldMappingBasedOnObject(objectApiName);

			if (utils.checkIfIsPipeLaunchUnlicensed(fieldMappingResponse)) {
				this._setUnlicensedMode();
				return;
			}

			this.customFieldMapping = utils.selectCustomFieldMappingObject(
				fieldMappingResponse,
				objectApiName
			);

			if (this.debug)
				console.info("Custom Field Mapping", this.customFieldMapping);
			this.fields = await generateFieldMapping(
				objectApiName,
				this.customFieldMapping
			);
			if (this.debug) console.info("Fields to fetch", this.fields);
			this.status.errors = undefined;
		} catch (error) {
			console.error(error);
			this.status.isLoading = false;
			this.status.errors = error;
		}
	}

	_checkLicenses(result) {
		if (!utils.checkIfIsLicensed(result)) {
			this._showUnlicensedMessage();
			return false;
		} else if (utils.checkIfIsPipeLaunchUnlicensed(result)) {
			this._setUnlicensedMode();
			return false;
		}
		return true;
	}

	async _searchOrGetData() {
		const hitHorizonsId = utils.getHitHorizonsId(
			this._recordData,
			this.customFieldMapping.HitHorizonsID
		);

		if (hitHorizonsId) {
			await this._getCompanyInformationById(hitHorizonsId);
		} else {
			this.status.isManualSearch = false;
			await this._searchCompany(this._generateSearchParams());
		}
	}

	_generateSearchParams(firstSearch = true) {
		const CompanyName = extractCompanyName(this._recordData);
		const Country = utils.getAccountFieldValue(
			this._recordData,
			this.customFieldMapping.Country
		);
		return {
			CompanyName,
			Country,
			ShowBranches: !firstSearch, // show branches on second search
			MaxResults: firstSearch
				? MAX_RESULTS_STRICT_SEARCH
				: MAX_RESULTS_SEARCH,
			strict: firstSearch
		};
	}

	async _searchCompany(params) {
		try {
			this.status.isLoading = true;
			this.status.errors = undefined;

			const result = await apex_searchCompany({
				options: JSON.stringify(params)
			});

			if (!this._checkLicenses(result)) return;

			const apiData = utils.processAndValidateSearchResults(result);
			if (this.debug) console.info("Received API data", apiData);

			if (
				!apiData &&
				this.status.isFirstSearch &&
				!this.status.isManualSearch
			) {
				if (this.debug)
					console.info("Do another search with less strict criteria");
				this.status.isFirstSearch = false;
				return await this._searchCompany(
					this._generateSearchParams(false)
				); // do the second search with no strict results
			}

			if (!apiData) {
				this._setView("notFoundMessage");
				this.searchResults = utils.resetSearchResults();
				this.status.isLoading = false;
				return;
			} else if (apiData.length === 1) {
				// found one match, open it directly
				this._getCompanyInformationById(apiData[0].HitHorizonsId);
				return;
			}

			const totalResults = apiData.length;
			this.searchResults.total = totalResults;
			this.searchResults.items = apiData;
			this.searchResults.displayItems = apiData.slice(
				0,
				PAGINATION_LIMIT
			);

			this._setView("searchCompany");
			this.status.isLoading = false;
		} catch (error) {
			console.error("Error searching company", error);
			this.status.isLoading = false;
			this.status.errors = error;
		}
	}

	async _getCompanyInformationById(companyId) {
		try {
			this.status.isLoading = true;
			this.status.errors = undefined;

			const result = await apex_getCompany({
				companyId
			});

			if (!this._checkLicenses(result)) return;

			const apiData = utils.processAndValidateCompanyResults(result);
			// const apiData = RESULT;
			if (this.debug)
				console.info("Company Information payload", apiData);
			this.companyInformation = Object.freeze(apiData);

			this._setView("companyInfo");

			if (
				this.status.isFirstSearch &&
				!utils.getHitHorizonsId(
					this._recordData,
					this.customFieldMapping.HitHorizonsID
				)
			) {
				this.status.showMatchBanner = true;
			} else {
				this.status.showSaveBanner =
					utils.generateUpdateFields(
						this._recordData,
						apiData,
						this.customFieldMapping
					).length > 0;
			}

			this.status.isLoading = false;
		} catch (error) {
			console.error(error);
			this.status.isLoading = false;
			this.status.errors = error;
		}
	}


	/**
	 * @description refresh apex with native method
	 */
	_refresh() {
		this.status.isLoading = true;
		refreshApex(this._getRecordDataResponse)
			.then(() => {
				this.status.isLoading = false;
			})
			.catch((error) => {
				console.error("Refreshing apex", error);
				this.status.isLoading = false;
				this.status.errors = error;
			});
	}
}
