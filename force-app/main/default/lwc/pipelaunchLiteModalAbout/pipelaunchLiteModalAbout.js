import { LightningElement, api } from "lwc";

// import apex_getManagedPackageVersion from "@salesforce/apex/Utilities.getManagedPackageVersion";

export default class PipelaunchLiteModalAbout extends LightningElement {
	version = "0.0";
	showDiagnostics = false;

	@api show() {
		this.template
			.querySelector('c-pipelaunch-lite-modal[data-selector="1"]')
			.show();
	}

	connectedCallback() {
		this._loadVersion();
	}

	async _loadVersion() {
		try {
			const version = await apex_getManagedPackageVersion();
			if (version) this.version = version;
		} catch (error) {
			console.error("Cannot retreive the package version", error);
		}
	}

	handleClickRunDiagnostics() {
		this.showDiagnostics = !this.showDiagnostics;
	}

	handleCloseModal() {
		this.showDiagnostics = false;
	}
}
