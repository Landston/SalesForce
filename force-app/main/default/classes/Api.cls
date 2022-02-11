public with sharing class Api {
	static final String API_ENDPOINT = 'https://api.pipelaunch.com/v1/';


	
	public static String hhcompanyget(String companyId) {
		if (String.isBlank(companyId)) {
            throw new IllegalArgumentException('Company ID is mandatory');
        }

		String param = 'hhcompanyget?HitHorizonsId=' + EncodingUtil.urlEncode(companyId, 'UTF-8');
		String jsonResult = Api.fetch(param);
		return jsonResult;
		// Map<String, Object> deserialized = (Map<String, Object>) JSON.deserializeUntyped(jsonResult);
		// return deserialized;
	}

	/**
	* @description 
	* @author scarreira@ibs-technology.com | 02-02-2022 
	* @param params 
	* @return String 
	**/
	public static String hhcompanysearch(PipelaunchCompanyInfoExtService.SearchCompanyOptions params) {
		List<String> get = new List<String>();
		get.add('MaxResults=' + params.MaxResults);
        get.add('ShowBranches=' + params.ShowBranches);

		if (String.isNotBlank(params.CompanyName)) {
			String companyNameParsed = params.strict ? '"' + params.CompanyName + '"' : params.CompanyName;
			get.add('CompanyName=' + System.EncodingUtil.URLEncode(companyNameParsed, 'UTF-8'));
		}
        
		if (String.isNotBlank(params.Country)) get.add('Country=' + EncodingUtil.URLEncode(params.Country,'UTF-8'));
		if (String.isNotBlank(params.DUNSNumber)) get.add('DUNSNumber=' + EncodingUtil.URLEncode(params.DUNSNumber,'UTF-8'));
		if (String.isNotBlank(params.TaxId)) get.add('TaxId=' + EncodingUtil.URLEncode(params.TaxId,'UTF-8'));
		if (String.isNotBlank(params.AddressUnstructured)) get.add('AddressUnstructured=' + EncodingUtil.URLEncode(params.AddressUnstructured,'UTF-8'));

		String paramsUrl = ('hhcompanysearch?' + String.join(get, '&'));
		System.debug(LoggingLevel.INFO, 'GET parameters: ' + paramsUrl);
		String jsonResult = Api.fetch(paramsUrl);
		// System.debug(LoggingLevel.INFO, jsonResult);
		return jsonResult;
		// Map<String, Object> deserialized = (Map<String, Object>) JSON.deserializeUntyped(jsonResult);
		// return deserialized;
	}

	

	private static String getApiToken() {
		// plaunch__CoreSetting__mdt result = Database.query('SELECT plaunch__token__c FROM plaunch__CoreSetting__mdt LIMIT 1');
		return 'developer-991f-42c3-bd6e-adbad5a2347f';
	}


	public static String fetch(String param) {
		// note: do not forget to add permissions to the endpoint
		// Setup->Security->Remote site settings

		String key = Api.getApiToken();

		if (String.isBlank(key)) {
			System.debug('No token');
			return null;
		}

		String url = API_ENDPOINT + param;

		// System.debug(LoggingLevel.INFO, url);

		HttpRequest req = new HttpRequest();
		Http http = new Http();
		HTTPResponse res = new HttpResponse();

		req.setEndpoint(url);
		req.setMethod('GET');
		req.setHeader('Accept', '*/*');
		// req.setHeader('Authorization', 'Bearer ' + UserInfo.getSessionID());
		req.setHeader('key', key);
		req.setHeader('Content-Type', 'application/json');

		req.setTimeout(50000);

		// Perform callout and set response
		res = http.send(req);

		if (res.getStatusCode() >= 400) {
			// System.debug('Error 40x');
			return null;
		}

		// check response
		if ((res.getStatusCode() == 200 || res.getStatusCode() == 201) && res.getBody() != null) {
			// System.debug('20x');
			return res.getBody();
		} else {
			return null;
		}
	}
}
