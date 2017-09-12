'use strict';
const ServiceBase = require('./ServiceBase');
// var AdyenErrors = require('./Errors');



class HPP extends ServiceBase{
  constructor(client){
    super(client);
    this.serviceName = "hpp";
    this.path = "/"+this.serviceName;
  }

  directoryLookup(request, callback){
    var action='directory';

    // Could add ability to provide sessionValidity if not provided.
    //
    // if (!('sessionValidity' in request)){
    //   let sessionValidity = new Date();
    //   // set session to be valid for 24 hours
    //   sessionValidity.setDate(sessionValidity.getDate() + 1);
    //   request.sessionValidity = sessionValidity.toISOString();
    // }
    return this.handleAsyncHpp(action,request,callback);
  }
}

module.exports = HPP;
