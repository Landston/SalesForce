/**
 * TODO: resize
 * no
 */
import { LightningElement, api } from 'lwc';
// import FORM_FACTOR from '@salesforce/client/formFactor'

export default class PipelaunchLiteModal extends LightningElement {
    @api visible;
    @api noBackdrop = false; // true to hide backdrop
    @api hideCloseButton = false;
    @api modalTagline = false;
    @api modalHeader = false;

    footerCssClasses = 'slds-modal__footer custom-slds-modal__footer-hidden';

    closeModal() {
        this.visible = false;
        this.dispatchEvent(
            new CustomEvent("closemodal")
        );
    }

    innerKeyUpHandler(event) {
        if (event.keyCode === 27 || event.code === 'Escape') {
            // this.closeModal();
            this.visible = false;
        }
    }

    @api show() {
        this.visible = true;
    }

    @api open() {
        this.visible = true;
    }

    @api close() {
        this.visible = false;
    }

    @api hide() {
        this.visible = false;
    }

    get computeHeaderCssClasses() {
        return (this.modalHeader || this.modalTagline) ? 'slds-modal__header' : 'slds-modal__header custom-slds-modal__header-hidden'
    }

    handleFooterSlotChange(event) {
        const slot = event.target !== undefined ? event.target : event.currentTarget;
        this.footerCssClasses = slot && slot.assignedElements().length > 0 ? 'slds-modal__footer' : 'slds-modal__footer custom-slds-modal__footer-hidden';
    }

}