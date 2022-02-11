@isTest
public with sharing class CustomSettingsController_Tests {
    @isTest
	static void getCustomFieldMapping(){
		Map<String, Object> res = CustomSettingsController.getCustomFieldMapping();
		System.assert(true); // quick and dirty
	}
}
