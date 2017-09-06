'use strict';
let ServiceBase = require('./ServiceBase');

class Recurring extends ServiceBase{
  constructor(client){
    super(client);
    this.PATH = "/pal/servlet/Recurring/";
  }

  listRecurringDetails(request, callback){
    let action = "listRecurringDetails";
    return this.handleAsync(action,request,callback);
  }
  disable(request, callback){
    let action = "disable";
    return this.handleAsync(action,request,callback);
  }
}

module.exports = Recurring;
