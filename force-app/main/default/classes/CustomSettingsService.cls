/**
 * @description       : Custom Settings Service
 * @group             : CustomSettings
 * @last modified on  : 02-09-2022
 * @last modified by  : scarreira@ibs-technology.com
**/
public with sharing class CustomSettingsService {
	/**
	* @description Get custom field mapping wrapper object response
	* @author scarreira@ibs-technology.com | 01-31-2022 
	* @return Map<String, Object> 
	**/
	public static Map<String, Object> getCustomFieldMappingManager() {
		Map<String, Object> result = new Map<String, Object>();
		Map<String, Object> customFieldMapping = CustomSettingsService.getCustomFieldMapping();
		result.put('Results', customFieldMapping);
		result.put('Error', null);
		return result;
	}

    /**
    * @description generates a map of custom field mapping. The values are stored on hiearchal custom settings
	* and we retrieve the org level values.
	* we query the standard objects fields to see if the fields are accessible and updatable and if a field is not
	* it will not be returned
	*
    * @author ilya.litovchik@succraft.com | 01-27-2022 
    * @return Map<String, Object> 
    **/
    public static Map<String, Object> getCustomFieldMapping() {
        Map<String, SObjectField> accountFieldMap = Schema.Account.getSObjectType().getDescribe().fields.getMap();
        Map<String, SObjectField> leadFieldMap = Schema.Lead.getSObjectType().getDescribe().fields.getMap();
        Map<String, SObjectField> contactFieldMap = Schema.Contact.getSObjectType().getDescribe().fields.getMap();
        Map<String, Map<String, String>> data = new Map<String, Map<String, String>>{
			'Account' => new Map<String, String>(),
			'Contact' => new Map<String, String>(),
			'Lead' => new Map<String, String>()
        };

        Map<String, Object> settings = CustomFieldMapping__c.getInstance(UserInfo.getOrganizationId()).getPopulatedFieldsAsMap();

        for (String key : DEFAULT_VALUES.keySet()) {
            String settingValue = (String) settings.get(key);
            String value = String.isBlank(settingValue) ? DEFAULT_VALUES.get(key) : (String) settings.get(key);
            String objectKey = '';

            Map<String, SObjectField> sObjectFieldMap = new Map<String, SObjectField>();

            if (key.contains('Account_')) {
                sObjectFieldMap = accountFieldMap;
                objectKey = 'Account';
            } else if (key.contains('Lead_') || key.contains('Company_')) {
                sObjectFieldMap = leadFieldMap;
                objectKey = 'Lead';
            } else if (key.contains('Contact_')) {
                sObjectFieldMap = contactFieldMap;
                objectKey = 'Contact';
            }

            DescribeFieldResult fieldResult = sObjectFieldMap.containsKey(value) ? sObjectFieldMap.get(value).getDescribe() : null;

            if (fieldResult == null || !fieldResult.isAccessible() || !fieldResult.isUpdateable() || value == '-') {
                value = null;
            }

            Map<String, String> objectMap = data.get(objectKey);

            if (API_LABEL_MAPPING.containsKey(objectKey)) {
                if(API_LABEL_MAPPING.get(objectKey).containsKey(key)){
                    objectMap.put(API_LABEL_MAPPING.get(objectKey).get(key), value);
                }
            }
        }

        return data;
    }

	private static final String NAMESPACE = ''; // namespace with underscores (to use in scratch orgs without namespace)

	// Default field Values
    private static Map<String, String> DEFAULT_VALUES = new Map<String, String>{
		NAMESPACE + 'Account_Annual_Revenue__c' => 'AnnualRevenue',
		NAMESPACE + 'Account_Brand_Name__c' => NAMESPACE + 'Brand_Name__c',
		NAMESPACE + 'Account_DunsNumber__c' => '',
		NAMESPACE + 'Account_Industry__c' => 'Industry',
		NAMESPACE + 'Account_LinkedIn__c' => NAMESPACE + 'LinkedIn__c',
		NAMESPACE + 'Account_Number_Of_Employees__c' => 'NumberOfEmployees',
		NAMESPACE + 'Account_SIC__c' => 'Sic',
		NAMESPACE + 'Account_Website__c' => 'Website',
		NAMESPACE + 'Account_YearStarted__c' => '',
		NAMESPACE + 'Account_Avatar_URL__c' => NAMESPACE + 'avatar_url__c',
		NAMESPACE + 'Account_Billing_City__c' => 'BillingCity',
		NAMESPACE + 'Account_Billing_Country__c' => 'BillingCountry',
		NAMESPACE + 'Account_Billing_Country_Code__c' => 'BillingCountryCode',
		NAMESPACE + 'Account_Billing_Street__c' => 'BillingStreet',
		NAMESPACE + 'Account_Postal_Code__c' => 'BillingPostalCode',
		NAMESPACE + 'Account_Billing_State__c' => 'BillingState',
		NAMESPACE + 'Account_Description__c' => 'Description',
		NAMESPACE + 'Account_Phone__c' => 'Phone',
		NAMESPACE + 'Account_HitHorizons_ID__c' => NAMESPACE + 'HitHorizonsID__c',
		NAMESPACE + 'Lead_Annual_Revenue__c' => 'AnnualRevenue',
		NAMESPACE + 'Lead_Brand_Name__c' => NAMESPACE + 'Brand_Name__c',
		NAMESPACE + 'Lead_DunsNumber__c' => '',
		NAMESPACE + 'Lead_Industry__c' => 'Industry',
		NAMESPACE + 'Lead_LinkedIn__c' => NAMESPACE + 'LinkedIn__c',
		NAMESPACE + 'Lead_Number_Of_Employees__c' => 'NumberOfEmployees',
		NAMESPACE + 'Lead_SIC__c' => '',
		NAMESPACE + 'Lead_Website__c' => 'Website',
		NAMESPACE + 'Lead_YearStarted__c' => '',
		NAMESPACE + 'Lead_Xing__c' => NAMESPACE + 'Xing__c',
		NAMESPACE + 'Lead_Avatar_URL__c' => NAMESPACE + 'avatar_url__c',
		NAMESPACE + 'Company_Avatar_URL__c' => NAMESPACE + 'Company_Avatar_URL__c',
		NAMESPACE + 'Company_LinkedIn__c' => NAMESPACE + 'Company_LinkedIn__c',
		NAMESPACE + 'Lead_City__c' => 'City',
		NAMESPACE + 'Lead_Country__c' => 'Country',
		NAMESPACE + 'Lead_Country_Code__c' => 'CountryCode',
		NAMESPACE + 'Lead_Billing_Street__c' => 'Street',
		NAMESPACE + 'Lead_Postal_Code__c' => 'PostalCode',
		NAMESPACE + 'Lead_Billing_State__c' => 'State',
		NAMESPACE + 'Lead_Description__c' => 'Description',
		NAMESPACE + 'Lead_Title__c' => 'Title',
		NAMESPACE + 'Lead_Phone__c' => 'Phone',
		NAMESPACE + 'Lead_Salutation__c' => 'Salutation',
		NAMESPACE + 'Lead_HitHorizons_ID__c' => NAMESPACE + 'HitHorizonsID__c',
		NAMESPACE + 'Contact_LinkedIn__c' => NAMESPACE + 'LinkedIn__c',
		NAMESPACE + 'Contact_Xing__c' => NAMESPACE + 'Xing__c',
		NAMESPACE + 'Contact_Avatar_URL__c' => NAMESPACE + 'avatar_url__c',
		NAMESPACE + 'Contact_Title__c' => 'Title',
		NAMESPACE + 'Contact_Phone__c' => 'Phone',
		NAMESPACE + 'Contact_Salutation__c' => 'Salutation'
    };
	
    private static Map<String, Map<String, String>> API_LABEL_MAPPING = new Map<String, Map<String, String>>{
		'Account' => new Map<String, String>{
				NAMESPACE + 'Account_Annual_Revenue__c' => 'AnnualRevenue',
				NAMESPACE + 'Account_Brand_Name__c' => 'BrandName',
				NAMESPACE + 'Account_DunsNumber__c' => 'DunsNumber',
				NAMESPACE + 'Account_Industry__c' => 'Industry',
				NAMESPACE + 'Account_LinkedIn__c' => 'LinkedIn',
				NAMESPACE + 'Account_Number_Of_Employees__c' => 'NumberOfEmployees',
				NAMESPACE + 'Account_SIC__c' => 'Sic',
				NAMESPACE + 'Account_Website__c' => 'Website',
				NAMESPACE + 'Account_YearStarted__c' => 'YearStarted',
				NAMESPACE + 'Account_Avatar_URL__c' => 'AvatarURL',
				NAMESPACE + 'Account_Billing_City__c' => 'City',
				NAMESPACE + 'Account_Billing_Country__c' => 'Country',
				NAMESPACE + 'Account_Billing_Country_Code__c' => 'CountryCode',
				NAMESPACE + 'Account_Billing_Street__c' => 'Street',
				NAMESPACE + 'Account_Postal_Code__c' => 'PostalCode',
				NAMESPACE + 'Account_Billing_State__c' => 'State',
				NAMESPACE + 'Account_Description__c' => 'Description',
				NAMESPACE + 'Account_Phone__c' => 'Phone',
				NAMESPACE + 'Account_HitHorizons_ID__c' => 'HitHorizonsID'
		},
		'Lead' => new Map<String, String>{
				NAMESPACE + 'Lead_Annual_Revenue__c' => 'AnnualRevenue',
				NAMESPACE + 'Lead_Brand_Name__c' => 'BrandName',
				NAMESPACE + 'Lead_DunsNumber__c' => 'CompanyDunsNumber',
				NAMESPACE + 'Lead_Industry__c' => 'Industry',
				NAMESPACE + 'Lead_LinkedIn__c' => 'LinkedIn',
				NAMESPACE + 'Lead_Number_Of_Employees__c' => 'NumberOfEmployees',
				NAMESPACE + 'Lead_SIC__c' => 'Sic',
				NAMESPACE + 'Lead_Website__c' => 'Website',
				NAMESPACE + 'Lead_YearStarted__c' => 'YearStarted',
				NAMESPACE + 'Lead_Xing__c' => 'Xing',
				NAMESPACE + 'Lead_Avatar_URL__c' => 'AvatarURL',
				NAMESPACE + 'Company_Avatar_URL__c' => 'CompanyAvatarURL',
				NAMESPACE + 'Company_LinkedIn__c' => 'CompanyLinkedIn',
				NAMESPACE + 'Lead_City__c' => 'City',
				NAMESPACE + 'Lead_Country__c' => 'Country',
				NAMESPACE + 'Lead_Country_Code__c' => 'CountryCode',
				NAMESPACE + 'Lead_Billing_Street__c' => 'Street',
				NAMESPACE + 'Lead_Postal_Code__c' => 'PostalCode',
				NAMESPACE + 'Lead_Billing_State__c' => 'State',
				NAMESPACE + 'Lead_Description__c' => 'Description',
				NAMESPACE + 'Lead_Title__c' => 'Title',
				NAMESPACE + 'Lead_Phone__c' => 'Phone',
				NAMESPACE + 'Lead_Salutation__c' => 'Salutation',
				NAMESPACE + 'Lead_HitHorizons_ID__c' => 'HitHorizonsID'
		},
		'Contact' => new Map<String, String>{
				NAMESPACE + 'Contact_LinkedIn__c' => 'LinkedIn',
				NAMESPACE + 'Contact_Xing__c' => 'Xing',
				NAMESPACE + 'Contact_Avatar_URL__c' => 'AvatarURL',
				NAMESPACE + 'Contact_Title__c' => 'Title',
				NAMESPACE + 'Contact_Phone__c' => 'Phone',
				NAMESPACE + 'Contact_Salutation__c' => 'Salutation'
		}
    };
}
