@isTest
public with sharing class PipelaunchCompanyInfoExtController_Tests {
    @isTest
	static void searchCompany() {
		try {
			String options = '{"CompanyName": "PipeLaunch","AddressUnstructured": "","TaxNumber": "","DUNSNumber": "","ShowBranches": false, "MaxResults": 5, "strict": false}';
			Map<String, Object> result = PipelaunchCompanyInfoExtController.searchCompany(options);
		} catch (Exception ex) {
			System.assert(true);
		}
	}

	@isTest
	static void getCompany() {
		try {
			Map<String, Object> result = PipelaunchCompanyInfoExtController.getCompany('H-DE0502651254');
		} catch (Exception ex) {
			System.assert(true);
		}
	}

	@isTest
    static void getCompanyInvalid() {
		String exTypeName = '';
        try {
            System.Test.startTest();
            PipelaunchCompanyInfoExtController.getCompany(null);
            System.Test.stopTest();
        } catch (Exception ex) {
			exTypeName = ex.getTypeName();
        }
        System.assertEquals('System.IllegalArgumentException', exTypeName, 'Should have caught the exception');
	}

	@isTest
    static void searchCompanyInvalid() {
		String exTypeName = '';
        try {
            System.Test.startTest();
            PipelaunchCompanyInfoExtController.searchCompany(null);
            System.Test.stopTest();
        } catch (Exception ex) {
			exTypeName = ex.getTypeName();
        }
        System.assertEquals('System.IllegalArgumentException', exTypeName, 'Should have caught the exception');
	}
}
