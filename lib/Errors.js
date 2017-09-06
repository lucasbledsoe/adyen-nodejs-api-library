'use strict';

class BaseAdyenError extends Error {
  constructor(message, errContent){
    super(message);
    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
    this.message = message;
    if (errContent){
      this.rawRequest = errContent.rawRequest;
      this.rawResponse = errContent.rawResponse;
      this.url = errContent.url;
      this.psp = errContent.psp;
      this.headers = errContent.headers;
      this.statusCode = errContent.statusCode;
    }
  }

  debug(){
      return "message: {}\n"    + this.message +
        "HTTP status_code:{}\n" + this.statusCode +
        "url: {}\n" + this.url +
        "request: {}\n" + this.rawRequest +
        "response: {}\n"+ this.rawResponse +
        "headers: {}" + this.headers;
  }

}

class InvalidRequestError extends BaseAdyenError{}

class APIResponseError extends BaseAdyenError{
  constructor(message, errContent){
    super(message, errContent);
    this.result=errContent.result;
    this.errorCode=errContent.errorCode;
    Error.captureStackTrace(this, APIResponseError);
  }
}

class APIAuthenticationError extends APIResponseError{}

class APIInvalidPermissionError extends APIResponseError{}

class APICommunicationError extends APIResponseError{}

class APIValidationError extends APIResponseError{}

class AdyenAPIInvalidAmount extends APIResponseError{}

class APIInvalidFormat extends APIResponseError{}


module.exports = {
  BaseAdyenError: BaseAdyenError,
  InvalidRequestError: InvalidRequestError,
  APIAuthenticationError: APIAuthenticationError,
  APIInvalidPermissionError: APIInvalidPermissionError,
  APICommunicationError: APICommunicationError,
  APIValidationError: APIValidationError,
  AdyenAPIInvalidAmount: AdyenAPIInvalidAmount,
  APIInvalidFormat: APIInvalidFormat
};
