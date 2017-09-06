'use strict';
let ServiceBase = require('./ServiceBase');
var AdyenErrors = require('./Errors');
var CryptoJS = require('cryptojs');



class HPP extends ServiceBase{
  constructor(client){
    super(client);
    this.PATH = "/hpp";
  }

  directoryLookup(request, callback){
    var action='directory';

    return this.handleAsync(action,request,callback);
  }
}

module.exports = HPP;
