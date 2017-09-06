'use strict';
let ServiceBase = require('./ServiceBase');

class Payout extends ServiceBase{
  constructor(client){
    super(client);
    this.PATH = "/pal/servlet/Payout";
  }

  storeDetailAndSubmitThirdParty(request, callback){
    let action = "storeDetailAndSubmitThirdParty";
    return this.handleAsync(action,request,callback);
  }
  submitThirdParty(request, callback){
    let action = "submitThirdParty";
    return this.handleAsync(action,request,callback);
  }
  confirmThirdParty(request, callback){
    let action = "confirmThirdParty";
    return this.handleAsync(action,request,callback);
  }
  declineThirdParty(request, callback){
    let action = "declineThirdParty";
    return this.handleAsync(action,request,callback);
  }
  storeDetail(request, callback){
    let action = "storeDetail";
    return this.handleAsync(action,request,callback);
  }
  storeDetailAndSubmit(request, callback){
    let action = "storeDetailAndSubmit";
    return this.handleAsync(action,request,callback);
  }
  submit(request, callback){
    let action = "submit";
    return this.handleAsync(action,request,callback);
  }
  confirm(request, callback){
    let action = "confirm";
    return this.handleAsync(action,request,callback);
  }
  decline(request, callback){
    let action = "decline";
    return this.handleAsync(action,request,callback);
  }
}





module.exports = Payout;
