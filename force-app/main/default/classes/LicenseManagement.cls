/**
 * @description       : LMO and FMA utilities
 * @group             : PipeLaunch Utilities
 * @last modified on  : 02-01-2022
 * @last modified by  : scarreira@ibs-technology.com
**/
public with sharing class LicenseManagement {
    
	/**
	* @description isRunningUserLicensed returns whether the running user is currently licensed
	* @author scarreira@ibs-technology.com | 08-05-2021 
	* @param withException true to throw custom exception if not licensed
	* @return Boolean indicating whether the user is licensed 
	**/
	public static Boolean isRunningUserLicensed(Boolean withException) {
		Boolean isLicensed;

		try {
			//When installed as a beta package, this returns true.
			//When installed as a released version, this is dependent on user license assignment
			String packageId = System.Packaging.getCurrentPackageId();
			isLicensed = System.UserInfo.isCurrentUserLicensedForPackage(packageId);
		} catch (Exception e) {
			// if source is deployed rather than a package install, this method will throw an error.
			// Treat like license is assigned
			isLicensed = true;
		}

		if (withException && !isLicensed) throw new LicenseManagementException();

		return isLicensed;
	}

	/**
	* @description 
	* Notes: https://developer.salesforce.com/docs/atlas.en-us.packagingGuide.meta/packagingGuide/fma_check_lmo-to-subscriber_values.htm
	* @author scarreira@ibs-technology.com | 08-05-2021 
	* @param withException true to throw custom exception if not licensed
	* @return Boolean true if the user is licensed for the current package
	**/
	public static Boolean isFeatureManagementEnabled(String featureName, Boolean withException) {
		Boolean result = System.FeatureManagement.checkPackageBooleanValue(featureName);

		if (withException && !result && !System.Test.isRunningTest()) throw new LicenseManagementException();

		return result;
	}

	public static Map<String, Object> UNLICENSED_RESPONSE = new Map<String, Object>{
		'Error' => 'UNLICENSED',
		'ErrorMessage' => 'PipeLaunch is not Licensed',
		'Results' => null
	};

	public static Map<String, Object> UNLICENSED_HITHORIZONS_RESPONSE = new Map<String, Object>{
		'Error' => 'HITHORIZONS_UNLICENSED',
		'ErrorMessage' => 'HitHorizons is not Licensed',
		'Results' => null
	};

	public class LicenseManagementException extends Exception {}
}
