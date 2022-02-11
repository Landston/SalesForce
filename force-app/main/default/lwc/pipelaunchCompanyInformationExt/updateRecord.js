import { updateRecord } from "lightning/uiRecordApi";

import { toast, errorToast } from "c/pipelaunchLiteUtils";

import {extractAccountOrLeadId} from "./utils";

export async function updateHitHorizonsId(recordData, fieldName, value = null) {
	try {
		const recordId = extractAccountOrLeadId(recordData);
		const fields = {};
		fields[fieldName] = value;
		await updateRecord({ fields, recordId });
		if (value === null) {
			toast({ title: "HitHorizons ID cleared", variant: "success" });
		}
	} catch (error) {
		console.error(error);
		errorToast({ title: "Cannot update the record data", error });
	}
}