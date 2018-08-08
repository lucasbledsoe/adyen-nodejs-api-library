'use strict';
let ServiceBase = require('./ServiceBase');

class Payment extends ServiceBase{
  constructor(client){
    super(client);
    this.serviceName = "Payment";
    this.version = 25;
  }

  authorise(request, callback){
    let action = "authorise";
    return this.handleAsyncApi(action,request,callback);
  }
  authorise3d(request, callback){
    let action = "authorise3d";
    return this.handleAsyncApi(action,request,callback);
  }
  cancel(request, callback){
    let action = "cancel";
    return this.handleAsyncApi(action,request,callback);
  }
  capture(request, callback){
    let action = "capture";
    return this.handleAsyncApi(action,request,callback);
  }
  refund(request, callback){
    let action = "refund";
    return this.handleAsyncApi(action,request,callback);
  }
  cancelOrRefund(request, callback){
    let action = "cancelOrRefund";
    return this.handleAsyncApi(action,request,callback);
  }
  voidPendingRefund(request, callback){
    let action = "voidPendingRefund";
    return this.handleAsyncApi(action,request,callback);
  }
  refundWithData(request, callback){
    let action = "refundWithData";
    return this.handleAsyncApi(action,request,callback);
  }
}





module.exports = Payment;
