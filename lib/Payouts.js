'use strict';
let ServiceBase = require('./ServiceBase');

class Payout extends ServiceBase{
  constructor(client){
    super(client);
    this.serviceName = "Payout";
    this.path = "/pal/servlet/";
  }

  storeDetailAndSubmitThirdParty(request, callback){
    let action = "storeDetailAndSubmitThirdParty";
    return this.handleAsyncApi(action,request,callback);
  }
  submitThirdParty(request, callback){
    let action = "submitThirdParty";
    return this.handleAsyncApi(action,request,callback);
  }
  confirmThirdParty(request, callback){
    let action = "confirmThirdParty";
    return this.handleAsyncApi(action,request,callback);
  }
  declineThirdParty(request, callback){
    let action = "declineThirdParty";
    return this.handleAsyncApi(action,request,callback);
  }
  storeDetail(request, callback){
    let action = "storeDetail";
    return this.handleAsyncApi(action,request,callback);
  }
  storeDetailAndSubmit(request, callback){
    let action = "storeDetailAndSubmit";
    return this.handleAsyncApi(action,request,callback);
  }
  submit(request, callback){
    let action = "submit";
    return this.handleAsyncApi(action,request,callback);
  }
  confirm(request, callback){
    let action = "confirm";
    return this.handleAsyncApi(action,request,callback);
  }
  decline(request, callback){
    let action = "decline";
    return this.handleAsyncApi(action,request,callback);
  }
}





module.exports = Payout;
