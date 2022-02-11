import { LightningElement, api } from "lwc";
import noDataIllustration from "./templates/noDataIllustration.html";
import inlineMessage from "./templates/inlineMessage.html";
import noResultsFound from "./templates/noResultsFound.html";
import noAccess from "./templates/noAccess.html";

const DEFAULT_FRIENDLY_MESSAGE =
  "Oops! Something went wrong. Please try again or contact the system administrator";
export default class PipelaunchLiteErrorPanel extends LightningElement {
  @api errors;
  @api type;
  @api illustration = "Open Road";
  @api noResultsFoundHeader = "No results found";
  @api noResultsFoundBody = ""; // Please try different search terms

  viewDetails = false;
  _friendlyMessage = DEFAULT_FRIENDLY_MESSAGE;

  render() {
    if (this.type === "inlineMessage") {
      return inlineMessage;
    } else if (this.type === "noResultsFound") {
      return noResultsFound;
    } else if (this.type === "noAccess") {
		return noAccess;
	}
    return noDataIllustration;
  }

  @api
  set friendlyMessage(value) {
    if (value && typeof value === "string" && value.trim().length > 0) {
      this._friendlyMessage = value.trim();
    } else {
      this._friendlyMessage = DEFAULT_FRIENDLY_MESSAGE;
    }
  }
  get friendlyMessage() {
    return this._friendlyMessage;
  }

  get errorMessages() {
    return reduceErrors(this.errors);
  }

  get isOpenRoad() {
    return this.illustration === "Open Road";
  }

  get isWalkthroughNotAvailable() {
    return this.illustration === "Walkthrough Not Available";
  }
}

/**
 * Reduces one or more LDS errors into a string[] of error messages.
 * @param {FetchResponse|FetchResponse[]} errors
 * @return {String[]} Error messages
 */
function reduceErrors(errors) {
  if (!Array.isArray(errors)) {
    errors = [errors];
  }

  return (
    errors
      .filter((error) => !!error)
      .map((error) => {
        if (Array.isArray(error.body)) {
          return error.body.map((e) => e.message);
        } else if (error.body && typeof error.body.message === "string") {
          return error.body.message;
        }
        // UI API DML, Apex and network errors but with object response
        else if (error.body && typeof error.body.message === "object") {
          return error.body.message.map((e) => e.message);
        } else if (typeof error.message === "string") {
          return error.message;
        }
        return error.statusText;
      })
      .reduce((prev, curr) => prev.concat(curr), [])
      // Remove empty strings
      .filter((message) => !!message)
  );
}
