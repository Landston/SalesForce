import { LightningElement, api } from 'lwc';

const VALID_SIZES = ["medium", "large", "small"];

export default class PipelaunchLitePipelaunchLogomark extends LightningElement {
    @api size = 'medium';

    /**
     * @type {String}
     */
    get computeCssClass() {
        if (this.size && VALID_SIZES.includes(this.size.toLowerCase())) {
            return this.size.toLowerCase();
        }
        return 'medium';
    }
}