'use strict';
let ServiceBase = require('./ServiceBase');

class Checkout extends ServiceBase{
  constructor(client){
    super(client);
    this.version = 33;
    this.serviceName = "Checkout";


    // Add payments, payments.details, and payments.result
    this.payments = (request, callback) => {
      this.details = this.paymentDetails;
      this.results = this.paymentResults;
      let action = "payments";
      return this.handleAsyncApi(action,request,callback);
    };

    this.payments.details = (request, callback) => {
      let action = "payments/details";
      return this.handleAsyncApi(action,request,callback);
    };

    this.payments.result = (request, callback) => {
      let action = "payments/details";
      return this.handleAsyncApi(action,request,callback);
    };
  }

  paymentSession(request, callback){
    let action = "paymentSession";
    return this.handleAsyncApi(action,request,callback);
  }
}


module.exports = Checkout;
