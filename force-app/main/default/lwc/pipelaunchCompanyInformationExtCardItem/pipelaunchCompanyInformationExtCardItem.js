import { LightningElement, api } from "lwc";

import generateFlagpediaLink from "./flagpedia";

export default class PipelaunchCompanyInformationExtCardItem extends LightningElement {
  @api details;

  /**
   * @type {String}
   */
  get computeFlagIcon() {
    return generateFlagpediaLink(this.details.Country.toLowerCase());
  }

  /**
   * @type {String}
   */
  get computeCompanyAddress() {
    if (!this.details.Country) return false;
    return `${this.details.City}${this.details.City ? "," : ""} ${this.details.Country}`;
  }

}
