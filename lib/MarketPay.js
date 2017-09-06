'use strict';
let validate = require('./validate');
let ServiceBase = require('./ServiceBase');

class MarketPay extends ServiceBase{
  constructor(client){
    super(client);
    this.PATH = "/pal/servlet/Recurring/";
  }

  closeAccount(request, callback){
    let action = "closeAccount";
    return this.handleAsync(action,request,callback);
  }

  closeAccountHolder(request, callback){
    let action = "closeAccountHolder";
    return this.handleAsync(action,request,callback);
  }
  createAccount(request, callback){
    let action = "createAccount";
    return this.handleAsync(action,request,callback);
  }
  createAccountHolder(request, callback){
    let action = "createAccountHolder";
    return this.handleAsync(action,request,callback);
  }
  deleteBankAccounts(request, callback){
    let action = "deleteBankAccounts";
    return this.handleAsync(action,request,callback);
  }
  deleteShareholders(request, callback){
    let action = "deleteShareholders";
    return this.handleAsync(action,request,callback);
  }
  getAccountHolder(request, callback){
    let action = "getAccountHolder";
    return this.handleAsync(action,request,callback);
  }
  getUploadedDocuments(request, callback){
    let action = "getUploadedDocuments";
    return this.handleAsync(action,request,callback);
  }
  suspendAccountHolder(request, callback){
    let action = "suspendAccountHolder";
    return this.handleAsync(action,request,callback);
  }
  unSuspendAccountHolder(request, callback){
    let action = "unSuspendAccountHolder";
    return this.handleAsync(action,request,callback);
  }
  updateAccount(request, callback){
    let action = "updateAccount";
    return this.handleAsync(action,request,callback);
  }
  updateAccountHolder(request, callback){
    let action = "updateAccountHolder";
    return this.handleAsync(action,request,callback);
  }
  updateAccountHolderState(request, callback){
    let action = "updateAccountHolderState";
    return this.handleAsync(action,request,callback);
  }
  uploadDocument(request, callback){
    let action = "uploadDocument";
    return this.handleAsync(action,request,callback);
  }
}

module.exports = MarketPay;
