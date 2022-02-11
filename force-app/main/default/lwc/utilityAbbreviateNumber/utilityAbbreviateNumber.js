/**
 * Abbreviate Number
 *
 * samples
 * <c-utility-abbreviate-number value=150000></c-utility-abbreviate-number>
 * returns -> 150k
 *
 * <c-utility-abbreviate-number value=1510 decimal=1></c-utility-abbreviate-number>
 * returns -> 1.51k
 */
import { LightningElement, api } from "lwc";
import abbreviateNumber from "./abbreviateNumber";
export default class UtilityAbbreviateNumber extends LightningElement {
    _decimal = 0;
    _value;

    @api get decimal() {
        return this._decimal;
    }
    set decimal(val) {
        this._decimal = val;
    }

    @api get value() {
        return this._value;
    }
    set value(val) {
        this._value = val;
    }

    get computedValue() {
        this._value = abbreviateNumber(this._value, this._decimal);
        return this._value;
    }

    
}