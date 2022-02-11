/**
 * @description       : Custom Settings Controller
 * @group             : CustomSettings
 * @last modified on  : 01-31-2022
 * @last modified by  : scarreira@ibs-technology.com
**/
public with sharing class CustomSettingsController {
    /**
    * @description Get custom field mapping from the custom settings (CustomFieldMapping__c)
    * @author scarreira@ibs-technology.com | 01-27-2022 
    * @return Map<String, Object> 
    **/
	@AuraEnabled(cacheable=true)
    public static Map<String, Object> getCustomFieldMapping() {
		try {
			if (!LicenseManagement.isRunningUserLicensed(false)) return LicenseManagement.UNLICENSED_RESPONSE;

			return CustomSettingsService.getCustomFieldMappingManager();
		} catch (Exception e) {
			System.debug(LoggingLevel.ERROR, e.getMessage());
			System.debug(LoggingLevel.ERROR, e.getStackTraceString());
			throw new AuraHandledException(e.getMessage()); 
		}
	}
}
