'use strict';
var validate = require('./validate');
var AdyenErrors = require('./Errors');
var util = require('util');



class ServiceBase{
  constructor(client){
    this.client = client;
    this.PATH="";
  }

  handleAsync(action, request, callback){
    callback = callback || function(){};
    return new Promise((resolve,reject) => {
      validate(action,request)
      .then(() =>{
        this.client.requestApi(this.PATH, action, request)
        .then(result => {
          resolve(result);
          callback(null, result);
        }).catch(err => {
          reject(err);
          callback(err);
        });
      }).catch(err => {
        reject(err);
        callback(err);
      });
    });
  }
}

module.exports = ServiceBase;
