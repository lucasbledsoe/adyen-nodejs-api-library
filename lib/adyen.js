'use strict';
const Payment = require('./Payment');
const Client = require('./Client');
const HPP = require('./HPP');
const Recurring = require('./Recurring');
const Payout = require('./Payout');
const Checkout = require('./Checkout');
const MarketPlace = require('./MarketPlace');

class Adyen{
  constructor(config){
    this.client = new Client(config);
    this.Payment = new Payment(this.client);
    this.Checkout = new Checkout(this.client);
    this.HPP = new HPP(this.client);
    this.Recurring = new Recurring(this.client);
    this.Payout = new Payout(this.client);
    this.MarketPlace = new MarketPlace(this.client);
  }

  get user(){return this.client.user;}
  set user(val){this.client.user=val;}

  get password(){return this.client.password;}
  set password(val){this.client.password=val;}

  get apiKey(){return this.client.apiKey;}
  set apiKey(val){this.client.apiKey=val;}

  get reviewPayoutUser(){return this.client.reviewPayoutUser;}
  set reviewPayoutUser(val){this.client.reviewPayoutUser=val;}

  get reviewPayoutPassword(){return this.client.reviewPayoutPassword;}
  set reviewPayoutPassword(val){this.client.reviewPayoutPassword=val;}

  get storePayoutUser(){return this.client.storePayoutUser;}
  set storePayoutUser(val){this.client.storePayoutUser=val;}

  get storePayoutPassword(){return this.client.storePayoutPassword;}
  set storePayoutPassword(val){this.client.storePayoutPassword=val;}

  get marketPlaceUser(){return this.client.marketPlaceUser;}
  set marketPlaceUser(val){this.client.marketPlaceUser=val;}

  get marketPlacePassword(){return this.client.marketPlacePassword;}
  set marketPlacePassword(val){this.client.marketPlacePassword=val;}

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
