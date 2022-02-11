/**
 * @description       : 
 * @group             : 
 * @last modified on  : 02-01-2022
 * @last modified by  : scarreira@ibs-technology.com
**/
public with sharing class PipelaunchCompanyInfoExtController {
    /**
    * @description
    * @author tatyana.kravtsova@succraft.com | 01-05-2022
    * @param companyId Company 14 digits ID (mandatory)
    **/
    @AuraEnabled(cacheable=true)
    public static Map<String, Object> getCompany(String companyId) {
		if (String.isBlank(companyId) || companyId.length() != 14) {
            throw new IllegalArgumentException('Enter a valid company ID');
        }

		try {
			return PipelaunchCompanyInfoExtService.getCompany(companyId);		
		} catch (Exception e) {
			System.debug(LoggingLevel.ERROR, e.getMessage());
			System.debug(LoggingLevel.ERROR, e.getStackTraceString());
			throw new AuraHandledException(e.getMessage()); 
		}
    }

	/**
    * @description
    * @author tatyana.kravtsova@succraft.com | 01-05-2022
    * @param companyName
    * @param country
    * @param showBranches
	* @param strict True to enable strict mode (company name with quotes)
    **/
    @AuraEnabled(cacheable=true)
    public static Map<String, Object> searchCompany(String options) {
		if (String.isBlank(options) ) {
            throw new IllegalArgumentException('Options is required');
        }

		try {
			return PipelaunchCompanyInfoExtService.searchCompany(options);
		} catch (Exception e) {
			System.debug(LoggingLevel.ERROR, e.getMessage());
			System.debug(LoggingLevel.ERROR, e.getStackTraceString());
			throw new AuraHandledException(e.getMessage()); 
		}
    }
}
