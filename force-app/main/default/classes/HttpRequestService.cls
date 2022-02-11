public with sharing class HttpRequestService {
    /*
    public static String DELETE_METHOD= 'DELETE';
    public static String GET_METHOD = 'GET';
    public static String POST_METHOD = 'POST';
    public static String HEAD_METHOD= 'HEAD';
    public static String PATCH_METHOD= 'PATCH';
    public static String PUT_METHOD= 'PUT';
    public static String TRACE_METHOD= 'TRACE';
    */

    public Enum HttpRequestMethod{
        HTTP_GET,
        HTTP_PUT,
        HTTP_DELETE,
        HTTP_HEAD,
        HTTP_PATCH,
        HTTP_TARCE
    }

    private static Map<String,String> httpMethods = new Map<String,String>{
        'GET' => 'GET',
        'POST' => 'POST',
        'DELETE' => 'DELETE',
        'HEAD' => 'HEAD',
        'PATCH'=> 'PATCH',
        'PUT' => 'PUT',
        'TRACE' => 'TRACE'
    };

    public static HttpResponse callOut(HttpRequestMethod method, String endPoint, Map<String,String> headerValueByName, Integer timeout, String requestBody) {
        if(requestBody == null || method == null || String.isBlank(endPoint) || timeout <=0 || timeout >120000) return null; //throw new CustomException('INVALIDA_PARAMETER');

        HttpRequest httpRequest = new HttpRequest();

        httpRequest.setMethod(method.name());
        httpRequest.setEndpoint(endpoint);
        httpRequest.setTimeout(timeout);

        httpRequest.setBody(requestBody);
        
        for (String header : headerValueByName.keySet()) {
            httpRequest.setHeader(header, headerValueByName.get(header));
        }

        Http http = new http();
        
        HttpResponse httpResponse = http.send(httpRequest);
        
        return httpResponse;
    }
    
    private static String handleResponse(Integer statusCode){
        /** parameter validation*/
        switch on (statusCode) {

            when 200 {
                return 'Success';
            }

            when 201 {
                return 'Created';
            }

            when 202 {
                return 'Created';
            }

            when 203 {
                return 'Non-Authoritative Information (since HTTP/1.1)';
            }

            when 204 {
                return 'No Content';
            }

            when 205 {
                return 'Reset Content';
            }

            when 300 {
                return 'Multiple Choices';
            }

            when 301 {
                return 'Moved Permanently';
            }

            when 302 {
                return 'Multiple Choices';
            }

            when 303 {
                return 'See Other ';
            }

            when 304 {
                return 'Not Modified';
            }

            when 305 {
                return ' Use Proxy ';
            }

            when 306 {
                return 'Switch Proxy';
            }

            when 307 {
                return 'Temporary Redirect';
            }

            when 308 {
                return 'Permanent Redirect';
            }

            when 400 {
                return 'Bad Request';
            }

            when 401 {
                return 'Unauthorized';
            }
            
            when 402 {
                return 'Payment Required';
            }

            when 403 {
                return 'Forbidden';
            }

            when 404 {
                return 'Not Found';
            }

            when 405{
                return 'Method Not Allowed';
            }

            when 406 {
                return 'Not Acceptable';
            }

            when 500 {
                return 'Internal server error';
            }

            when 502 {
                return 'Bad Gateway';
            }

            when 503 {
                return 'Service Unavailable';
            }

            when 504 {
                return 'Gateway Timeout';
            }
            
            when else { 
                return 'Error';
            } 
        }
    
    }
}
