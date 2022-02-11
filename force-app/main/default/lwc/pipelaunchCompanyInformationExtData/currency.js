import CURRENCY from '@salesforce/i18n/currency';

export default function displayInEuros() {
    return CURRENCY === "EUR";
}