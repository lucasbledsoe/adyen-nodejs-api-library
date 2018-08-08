'use strict';
var validate = require('./validate');
// var AdyenErrors = require('./Errors');
// var util = require('util');

//Return callback if present else resolve/rejected promise
const returnErr = err => cb => {if (cb) return cb(err); else return Promise.reject(err);};
const returnSuccess = res => cb => {if(cb) return cb(null,res); else return Promise.resolve(res);};

class ServiceBase{
  constructor(client){
    this.client = client;
    this.serviceName="";
    this.path="";
  }

  handleAsyncApi(action, request, callback){
    if (callback && (typeof callback !== 'function')) throw new TypeError('Callback must be function');

    return validate(action,request)
    .then(() =>{
      return this.client.requestApi(this.serviceName, this.version, action, request)
      .then(result => {
        return returnSuccess(result)(callback);
      }).catch(err => {
        return returnErr(err)(callback);
      });
    }).catch(err => {
      return returnErr(err)(callback);
    });
  }

  handleAsyncHpp(action, request, callback){
    if (callback && (typeof callback !== 'function')) throw new TypeError('Callback must be function');

    return validate(action,request)
    .then(() =>{
      return this.client.requestHpp(this.serviceName, this.version, action, request)
      .then(result => {
        return returnSuccess(result)(callback);
      }).catch(err => {
        return returnErr(err)(callback);
      });
    }).catch(err => {
      return returnErr(err)(callback);
    });

  }
}

module.exports = ServiceBase;
