'use strict';
const https = require('https');
const AdyenErrors = require('./Errors');
const queryString = require('querystring');
const CryptoJS = require('crypto-js');

const BASE_TEST_URL = "pal-test.adyen.com";
const BASE_LIVE_URL = "pal-live.adyen.com";
const BASE_HPP_TEST_URL = "test.adyen.com";
const BASE_HPP_LIVE_URL = "live.adyen.com";
const VALID_CONFIG_VALUES = [
  'user',
  'password',
  'storePayoutUser',
  'storePayoutPassword',
  'reviewPayoutUser',
  'reviewPayoutPassword',
  'skinCode',
  'hmacKey',
  'platform',
  'merchantAccount',
  'appName',
  'merchantSpecificUrl'
];
// const PROTOCOL = "https://";
const API_VERSION = "/v25";
const DIRECTORY_LOOKUP_VERSION = "/v2";
const USER_AGENT_SUFFIX = "adyen-node-api-library/";
const LIB_VERSION = "1.0.0";
const USER_AGENT = USER_AGENT_SUFFIX + "/" + LIB_VERSION + " " + "node/" + process.version;

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
  }

  determineCredentials(servicePath,action){
    if (servicePath === "Payout"){
      if (action.indexOf("confirm") === -1 ){
        return [this.reviewPayoutUser, this.reviewPayoutPassword];
      }
      return [this.storePayoutUser, this.storePayoutPassword];
    }
    return [this.user, this.password];
  }

  requestApi(servicePath, action, request){
    return new Promise((resolve,reject) => {
      const hostName = ((this.platform === "live") ? BASE_LIVE_URL : BASE_TEST_URL);
      const path = servicePath + API_VERSION + '/' + action;
      const [user,password] = this.determineCredentials(servicePath,action);
      const base64AuthHeader = new Buffer(user + ":" + password).toString('base64');

      var postData = JSON.stringify(request);
      var options = {
        hostname: hostName,
        path: path,
        method: 'POST',
        port: 443,
        headers:{
          'Content-Type': "application/json",
          'Content-Length': Buffer.byteLength(postData),
          'Authorization': "Basic " + base64AuthHeader,
        }
      };

      this._httpRequest(options, postData, hostName + path)
      .then(resolve).catch(reject);
    });
  }

  requestHpp(servicePath, action, request){
    return new Promise((resolve, reject)=>{
      const hostName = ((this.platform === "live") ? BASE_HPP_LIVE_URL : BASE_HPP_TEST_URL);
      const version = action === "directory" ? DIRECTORY_LOOKUP_VERSION : "";
      const path = servicePath + "/" + action + version + ".shtml";

      const postData = queryString.stringify(request);
      const options = {
        hostName: hostName,
        port: 443,
        path: path,
        method: "POST",
        headers:{
          'Content-Type' : 'application/x-www-form-urlencoded',
          'Content-Length' : Buffer.byteLength(postData)
        }
      };

      this._httpRequest(options, postData, hostName + path, request)
      .then(resolve).catch(reject);
    });
  }

  generate256HMAC(request){
    var keys = [];
    var values = [];
    for(var k of request) {keys.push(k);}
    keys.sort();

    keys = keys.map((k)=>{values.push(request[k]);});
    // for(var i=0;i<keys.length;i++){values.push(request[keys[i]]);}

    keys = keys.join(":");
    keys += ":";
    values = values.join(":");

    var signData = keys.concat(values);

    var hex = CryptoJS.enc.Hex.parse(this.client.hmacKey);

    var hash = CryptoJS.HmacSHA256(signData, hex);
    var hashInBase64 = CryptoJS.enc.Base64.stringify(hash);
    return hashInBase64;
  }

  _httpRequest(options, postData, url, originalRequest){
    return new Promise((resolve,reject)=>{
      const userAgentString = this.appName + " " + USER_AGENT;
      options['User-Agent'] = userAgentString;

      var req = https.request(options, (result) => {
        var rawResult = [];
        result.setEncoding('utf8');
        result.on('data',(chunk) => {
          rawResult.push(chunk);
        });
        result.on('end',() => {
          rawResult = rawResult.join("");
          resolve(this._handleResponse(rawResult,result.statusCode,postData, url,
            result.headers, originalRequest));
        });
        result.on('error',(err) => {
          reject(err);
        });
      });

      req.on('error', reject);
      req.write(postData);
      req.end();
    });
  }

  _handleResponse(rawResponse, statusCode, rawRequest, url, headers, originalRequest){
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
        this._handleHttpError(adyenResult, url, headers).catch(err=>{reject(err);});
      } else{
        try {
          let parsedRes = JSON.parse(rawResponse);
          Object.assign(adyenResult,parsedRes);
          resolve(adyenResult);
        } catch(err){
          //Couldn't parse JSON, pull error from html
          const error = this._errorFromHpp(rawResponse);
          reject(new AdyenErrors.InvalidRequestError(
            `Unable to retrieve payment list. Received the error: ${error}. Please ` +
            `verify your request and try again. If the issue persists, please reach` +
            ` out to support@adyen.com including the merchantReference: ` +
            `${originalRequest.merchantReference}`
          ));
          this._handleHttpError(adyenResult, url, headers).catch(err=>{reject(err);});
        }
      }
    });
  }

  _handleHttpError(adyenResult, url, headers){
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
            errmsg = "Unable to perform the requested action. message: ${adyenResult.message}." +
            " If you think your webservice user: ${this.user} might not have the necessary " +
            "permissions to perform this request. Please reach out to support@adyen.com, " +
            "providing the PSP reference: ${adyenResult.psp}";
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
  _errorFromHpp(html){
    let reObj = />Error:\s*(.*?)<br/;
    let result = reObj(html);
    if (result[0]){
      return result[0];
    }
  }
};
