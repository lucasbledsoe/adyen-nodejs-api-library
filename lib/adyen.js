'use strict';
var Payment = require('./Payment');
var Client = require('./Client');
var HPP = require('./HPP');
var Recurring = require('./Recurring');


class Adyen{
  constructor(config){
    this.client = new Client(config);
    this.Payment = new Payment(this.client);
    this.HPP = new HPP(this.client);
    this.Recurring = new Recurring(this.client);
  }

  get user(){return this.client.user;}
  set user(val){this.client.user=val;}

  get password(){return this.client.password;}
  set password(val){this.client.password=val;}

  get skinCode(){return this.client.skinCode;}
  set skinCode(val){this.client.skinCode=val;}

  get hmac(){return this.client.hmac;}
  set hmac(val){this.client.hmac=val;}

  get platform(){return this.client.platform;}
  set platform(val){this.client.platform=val;}

  get merchantAccount(){return this.client.merchantAccount;}
  set merchantAccount(val){this.client.merchantAccount=val;}

  get appName(){return this.client.appName;}
  set appName(val){this.client.appName=val;}
}


module.exports = Adyen;
