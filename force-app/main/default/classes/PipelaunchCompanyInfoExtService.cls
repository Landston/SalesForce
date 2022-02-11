/**
 * @description       : 
 * @group             : 
 * @last modified on  : 02-03-2022
 * @last modified by  : scarreira@ibs-technology.com
**/
public with sharing class PipelaunchCompanyInfoExtService {
	private static Integer MAX_RESULTS = 20;
	private static String HITHORIZONS_FEATURE_NAME = 'HitHorizonsEnabled';

    /**
    * @description 
    * @author scarreira@ibs-technology.com | 02-01-2022 
    * @param companyId 
    * @return Map<String, Object> 
    **/
    public static Map<String, Object> getCompany(String companyId) {
		Map<String, Object> unlicenseStatus = checkUnlicenseStatus();
		if (unlicenseStatus != null) return unlicenseStatus;

		Map<String, Object> result = new Map<String, Object>();
		String getResult = Api.hhcompanyget(companyId);
		// result.put('Results', getResult.get('items'));
		result.put('Results', getResult);
		result.put('Error', null);

		return result;
	}

	/**
	* @description 
	* @author scarreira@ibs-technology.com | 02-01-2022 
	* @param companyName 
	* @param country 
	* @param showBranches 
	* @param strict 
	* @return Map<String, Object> 
	**/
	public static Map<String, Object> searchCompany(String options) {
		Map<String, Object> unlicenseStatus = checkUnlicenseStatus();
		if (unlicenseStatus != null) return unlicenseStatus;

		SearchCompanyOptions params = SearchCompanyOptions.parseOptions(options);
		if (params.MaxResults == null) params.MaxResults = MAX_RESULTS;
		if (params.strict == null) params.strict = false;
		String searchResult = Api.hhcompanysearch(params);

		Map<String, Object> result = new Map<String, Object>();
		result.put('Results', searchResult);
		result.put('Error', null);
		return result;
	}


	/**
	* @description Check if Pipelaunch and Hithorizons is licensed
	* @author scarreira@ibs-technology.com | 02-01-2022 
	* @return Map<String, Object> Returns null if Pipelaunch and Hithorizons is licensed, otherwise returns an error payload
	**/
	private static Map<String, Object> checkUnlicenseStatus() {
		if (!LicenseManagement.isRunningUserLicensed(false)) {
			return LicenseManagement.UNLICENSED_RESPONSE;
		}

		if (!LicenseManagement.isFeatureManagementEnabled(HITHORIZONS_FEATURE_NAME, false)) {
			return LicenseManagement.UNLICENSED_HITHORIZONS_RESPONSE;
		}

		return null;
	}

	/**
	* @description Use a JSON string because exposing a aura public properties can be buggy
	* @author scarreira@ibs-technology.com | 02-02-2022 
	* @param json 
	* @return SearchCompanyOptions Parsed Options
	**/
	private static SearchCompanyOptions parseOptions(String json) {
		return (SearchCompanyOptions) System.JSON.deserialize(json, SearchCompanyOptions.class);
	}

	public class SearchCompanyOptions {
		public String CompanyName;
		public String Country;
		public String DUNSNumber;
		public String TaxId;
		public String AddressUnstructured;
		public Integer MaxResults;
		public Boolean ShowBranches;
		public Boolean strict;
	}
}
