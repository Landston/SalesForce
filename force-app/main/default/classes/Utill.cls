public with sharing class Utill {
    @AuraEnabled
    public static Boolean checkCountryPickListActivation(){
        return Account.getSObjectType().getDescribe().fields.getMap().containsKey('BillingCountryCode');

    }
}
