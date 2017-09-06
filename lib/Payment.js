'use strict';
let ServiceBase = require('./ServiceBase');

class Payment extends ServiceBase{
  constructor(client){
    super(client);
    this.PATH = "/pal/servlet/Payment";
  }

  authorise(request, callback){
    let action = "authorise";
    return this.handleAsync(action,request,callback);
  }
  authorise3d(request, callback){
    let action = "authorise3d";
    return this.handleAsync(action,request,callback);
  }
  cancel(request, callback){
    let action = "cancel";
    return this.handleAsync(action,request,callback);
  }
  capture(request, callback){
    let action = "capture";
    return this.handleAsync(action,request,callback);
  }
  refund(request, callback){
    let action = "refund";
    return this.handleAsync(action,request,callback);
  }
  cancelOrRefund(request, callback){
    let action = "cancelOrRefund";
    return this.handleAsync(action,request,callback);
  }
  voidPendingRefund(request, callback){
    let action = "voidPendingRefund";
    return this.handleAsync(action,request,callback);
  }
  refundWithData(request, callback){
    let action = "refundWithData";
    return this.handleAsync(action,request,callback);
  }
}





module.exports = Payment;
