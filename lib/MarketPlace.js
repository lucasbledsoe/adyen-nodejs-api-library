'use strict';
const ServiceBase = require('./ServiceBase');

class Fund extends ServiceBase{
  constructor(client){
    super(client);
    this.serviceName = "Fund";
    this.version = 4;
  }
  payoutAccountHolder(request, callback){
    let action = "payoutAccountHolder";
    return this.handleAsyncApi(action,request,callback);
  }
  accountHolderBalance(request, callback){
    let action = "accountHolderBalance";
    return this.handleAsyncApi(action,request,callback);
  }
  accountHolderTransactionList(request, callback){
    let action = "acountHolderTransactionList";
    return this.handleAsyncApi(action,request,callback);
  }
  refundNotPaidOutTransfers(request, callback){
    let action = "refundNotPaidOutTransfers";
    return this.handleAsyncApi(action,request,callback);
  }
  setupBenficiary(request, callback){
    let action = "setupBenficiary";
    return this.handleAsyncApi(action,request,callback);
  }
  tranferFunds(request, callback){
    let action = "tranferFunds";
    return this.handleAsyncApi(action,request,callback);
  }
}

class Account extends ServiceBase{
  constructor(client){
    super(client);
    this.serviceName="Account";
    this.version = 4;
  }
  closeAccount(request, callback){
    let action = "closeAccount";
    return this.handleAsyncApi(action,request,callback);
  }

  closeAccountHolder(request, callback){
    let action = "closeAccountHolder";
    return this.handleAsyncApi(action,request,callback);
  }
  createAccount(request, callback){
    let action = "createAccount";
    return this.handleAsyncApi(action,request,callback);
  }
  createAccountHolder(request, callback){
    let action = "createAccountHolder";
    return this.handleAsyncApi(action,request,callback);
  }
  deleteBankAccounts(request, callback){
    let action = "deleteBankAccounts";
    return this.handleAsyncApi(action,request,callback);
  }
  deleteShareholders(request, callback){
    let action = "deleteShareholders";
    return this.handleAsyncApi(action,request,callback);
  }
  getAccountHolder(request, callback){
    let action = "getAccountHolder";
    return this.handleAsyncApi(action,request,callback);
  }
  getUploadedDocuments(request, callback){
    let action = "getUploadedDocuments";
    return this.handleAsyncApi(action,request,callback);
  }
  suspendAccountHolder(request, callback){
    let action = "suspendAccountHolder";
    return this.handleAsyncApi(action,request,callback);
  }
  unSuspendAccountHolder(request, callback){
    let action = "unSuspendAccountHolder";
    return this.handleAsyncApi(action,request,callback);
  }
  updateAccount(request, callback){
    let action = "updateAccount";
    return this.handleAsyncApi(action,request,callback);
  }
  updateAccountHolder(request, callback){
    let action = "updateAccountHolder";
    return this.handleAsyncApi(action,request,callback);
  }
  updateAccountHolderState(request, callback){
    let action = "updateAccountHolderState";
    return this.handleAsyncApi(action,request,callback);
  }
  uploadDocument(request, callback){
    let action = "uploadDocument";
    return this.handleAsyncApi(action,request,callback);
  }
}



class MarketPlace {
  constructor(client){
    this.Account = new Account(client);
    this.Fund = new Fund(client);
  }
}

module.exports = MarketPlace;
