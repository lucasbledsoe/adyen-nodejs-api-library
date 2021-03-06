'use strict';
let ServiceBase = require('./ServiceBase');

class Recurring extends ServiceBase{
  constructor(client){
    super(client);
    this.serviceName = "Recurring";
    this.version = 25;
  }

  listRecurringDetails(request, callback){
    let action = "listRecurringDetails";
    return this.handleAsyncApi(action,request,callback);
  }
  disable(request, callback){
    let action = "disable";
    return this.handleAsyncApi(action,request,callback);
  }
}

module.exports = Recurring;
