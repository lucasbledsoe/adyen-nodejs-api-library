'use strict';
const HttpClient = require('./HttpClient');
const AdyenErrors = require('./Errors');
const AdyenUtil = require('./AdyenUtil');

const VALID_CONFIG_VALUES = [
  'user',
  'password',
  'apiKey',
  'appName',
  'storePayoutUser',
  'storePayoutPassword',
  'reviewPayoutUser',
  'reviewPayoutPassword',
  'marketPlaceUser',
  'marketPlacePassword',
  'skinCode',
  'hmacKey',
  'platform',
  'merchantAccount',
  'appName',
  'merchantSpecificUrl',
  'timeout'
];

const DIRECTORY_LOOKUP_VERSION = "/v2";

const USER_AGENT_SUFFIX = "adyen-node-api-library/";
const LIB_VERSION = "1.0.0";
const USER_AGENT = USER_AGENT_SUFFIX + LIB_VERSION + " " + "node/" + process.version;

module.exports = class Client{
  constructor(config){
    config = config || {};
    for (var key of VALID_CONFIG_VALUES){
      if(key in config){
        this[key] = config[key];
      }
    }
    if (!this.platform){
      this.platform = 'test';
    }

    this.appName = this.appName || "";
    this.userAgent = this.appName + USER_AGENT;
    this.httpClient = new HttpClient();
  }

  determineCredentials(serviceName, action){
    switch (serviceName){
      case 'Payout':
        if (action.indexOf("confirm") === -1 ){
          return [this.reviewPayoutUser, this.reviewPayoutPassword];
        }
        return [this.storePayoutUser, this.storePayoutPassword];
      case 'Fund':
      case 'Account':
        return [this.marketPlaceUser, this.marketPlacePassword];
      default:
        //Default to using apiKey
        return this.apiKey === null ? this.apiKey : [this.user, this.password];
    }
  }

  determinehostName(serviceName){
    switch (serviceName){
      case 'Checkout':
        return `checkout-${this.platform}.adyen.com`;
      case 'Fund':
      case 'Account':
        return `cal-${this.platform}.adyen.com`;
      case 'Payment':
      case 'Payout':
      case 'Recurring':
        return `pal-${this.platform}.adyen.com`;
      case 'hpp':
        return `${this.platform}.adyen.com`;
    }
  }

  determineMerchantAccount(serviceName, request){
    //marketpay APIs
    if (serviceName === 'Fund' || serviceName === 'Account')
      return delete request.merchantAccount;
    request.merchantAccount = request.merchantAccount || this.merchantAccount;
  }

  determinePath(serviceName,version,action){
    switch (serviceName){
      case "Checkout":
        return `/v${version}/${action}`;
      case 'Fund':
      case 'Account':
        return `/cal/services/${serviceName}/${version}/${action}`;
      case 'Payment':
      case 'Payout':
      case 'Recurring':
        return `/pal/servlet/${serviceName}/v${version}/${action}`;
      case 'hpp':
        return `/${action}/${DIRECTORY_LOOKUP_VERSION}.shtml`;
    }
  }

  requestApi(serviceName, version, action, request){ return new Promise((resolve,reject) => {
      const hostName = this.determinehostName(serviceName);
      const path = this.determinePath(serviceName,version,action);
      const url = hostName + path;
      this.determineMerchantAccount(serviceName, request);

      var options = {
        hostName: hostName,
        path: path,
        method: 'POST',
        port: 443,
        json: true,
        headers:{
          'User-Agent': this.userAgent
        },
        timeout: this.timeout || 30000
      };

      const creds = this.determineCredentials(serviceName,action);
      var user = null;
      if (creds instanceof String){
        options.headers['X-API-KEY'] = creds;
      } else {
        user = creds[0];
        options.basicAuth = {
          user : user,
          password : creds[1]
        };
      }

      this.httpClient.request(options, request, url)
      .then(res =>{return this._handleResponse(res, user);}).then(resolve).catch(reject);
    });
  }

  requestHpp(serviceName, servicePath, action, request){
    return new Promise((resolve, reject)=>{
      const hostName = this.determinehostName(serviceName, servicePath);
      const path = this.determinePath(servicePath,serviceName, action);
      request.merchantAccount = request.merchantAccount || this.merchantAccount;
      request.skinCode = request.skinCode || this.skinCode;
      request.merchantSig = AdyenUtil.generate256HMAC(request, this.hmacKey);

      const options = {
        hostName: hostName,
        path: path,
        method: 'POST',
        port: 443,
        headers:{
          'User-Agent': this.userAgent
        },
        timeout: this.timeout || 30000
      };

      this.httpClient.request(options, request, hostName + path)
      .then(res =>{return this._handleResponse(res);}).then(resolve).catch(reject);
  });
  }

  _handleResponse(httpResult, user){
    const rawResponse = httpResult.rawResponse,
      statusCode = httpResult.statusCode,
      rawRequest = httpResult.rawRequest,
      url = httpResult.url,
      headers = httpResult.headers,
      originalRequest = httpResult.originalRequest;

    return new Promise((resolve,reject) => {
      var psp = headers.pspreference || "";
      var adyenResult = {};
      adyenResult.statusCode = statusCode;
      adyenResult.rawRequest = rawRequest;
      adyenResult.rawResponse = rawResponse;
      adyenResult.psp = psp;
      if (statusCode !== 200){
        try {
          let parsedRes = JSON.parse(rawResponse);
          Object.assign(adyenResult,parsedRes);
        } catch(_){}
        this._handleHttpError(adyenResult, url, user).catch(reject);
      } else{
        try {
          let parsedRes = JSON.parse(rawResponse);
          Object.assign(adyenResult,parsedRes);
          resolve(adyenResult);
        } catch(err){
          //Couldn't parse JSON, pull error from html
          console.log(rawResponse);
          const error = AdyenUtil._errorFromHpp(rawResponse);
          reject(new AdyenErrors.InvalidRequestError(
            `Unable to retrieve payment list. Received the error: ${error}. Please ` +
            `verify your request and try again. If the issue persists, please reach` +
            ` out to support@adyen.com including the merchantReference: ` +
            `${originalRequest.merchantReference}`
          ));
          this._handleHttpError(adyenResult, url, user).catch(err=>{reject(err);});
        }
      }
    });
  }

  _handleHttpError(adyenResult, url, user){
    return new Promise((resolve, reject) => {
      var err;
      switch(adyenResult.statusCode){
        case 404:
          if (this.merchantSpecificUrl){
            reject(new AdyenErrors.APICommunicationError(
              `Received a 404 for url:'${url}'. Please ensure that the custom merchant` +
              ` specific url is correct`,
              adyenResult
            ));
          } else{
            err = new AdyenErrors.APICommunicationError(
              'Unexpected error while communicating with Adyen. Please reach out to ' +
              'support@adyen.com if the problem persists',
              adyenResult
            );
            reject(err);
          }
          break;
        case 400:
        case 422:
          err = new AdyenErrors.APIValidationError(
            `Received validation error with errorCode: ${adyenResult.errorCode}, ` +
            `message: ${adyenResult.message}, HTTP Code: ${adyenResult.statusCode}.` +
            ` Please verify the values provided. Please reach out to support@adyen.com` +
            ` if the problem persists, providing the PSP reference: ${adyenResult.psp}`,
            adyenResult
          );
          reject(err);
          break;
        case 401:
          reject( new AdyenErrors.APIAuthenticationError(
            "Unable to authenticate with Adyen's Servers. Please verify the credentials" +
            " provided. Please reach out to your Adyen Admin if the problem persists",
            adyenResult
          ));
          break;
        case 403:
          var errmsg = "";
          if ('message' in adyenResult && adyenResult.message === "Invalid Merchant Account"){
            errmsg = `You provided the merchant account:'${this.merchantAccount}' that ` +
            `doesn't exist or you don't have access to it.\nPlease verify the merchant ` +
            `account provided. \nReach out to support@adyen.com if the issue persists`;
          } else{
            errmsg = `Unable to perform the requested action. message: ${adyenResult.message}.` +
            ` If you think your webservice user: ${user} might not have the necessary ` +
            `permissions to perform this request. Please reach out to support@adyen.com, ` +
            `providing the PSP reference: ${adyenResult.psp}`;
          }
           err = new AdyenErrors.APIInvalidPermissionError(errmsg, adyenResult);
          reject(err);
          break;
        default:
           err = new AdyenErrors.APICommunicationError(
            `Unexpected error while communicating with Adyen. Received the response `+
            `data:'${adyenResult.rawResponse}', HTTP Code:'${adyenResult.statusCode}'.` +
            ` Please reach out to support@adyen.com if the problem persists with `+
            `the psp:${adyenResult.psp}`,
            adyenResult
          );
          reject(err);
          break;

      }
    });
  }
};
