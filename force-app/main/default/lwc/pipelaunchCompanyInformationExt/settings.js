import userID from "./userid";

export const DEFAULT_SETTINGS = {
	showMap: false,
	showExactFigures: false,
};

function generateLocalStorageKey() {
	return `PipeLaunchCompanyInformationExt_Settings__${userID}`;
}

function applyDefaults(settings) {
	!Object.prototype.hasOwnProperty.call(settings, "showMap") &&
		(settings.showMap = DEFAULT_SETTINGS.showMap);
}

export function saveSettings(settings) {
	localStorage.setItem(generateLocalStorageKey(), JSON.stringify(settings));
}

export function loadSettings() {
	const settings = DEFAULT_SETTINGS;

	const storedValue = localStorage.getItem(generateLocalStorageKey());
	const json = JSON.parse(storedValue) || [];
	applyDefaults(json);
	return { ...settings, ...json };
}
