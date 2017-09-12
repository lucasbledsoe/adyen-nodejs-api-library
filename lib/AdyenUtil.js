'use strict';
var CryptoJS = require('crypto-js');


module.exports = {
  generate256HMAC: function(request, hmacKey){
    var keys = [];
    var values = [];
    for(var k of Object.keys(request)) {keys.push(k);}
    keys.sort();
    keys.map((k)=>{values.push(request[k].replace(/\\/g,'\\\\').replace(/:/g,"\\:"));});

    keys = keys.join(":");
    keys += ":";
    values = values.join(":");

    var signData = keys.concat(values);
    var hex = CryptoJS.enc.Hex.parse(hmacKey);

    var hash = CryptoJS.HmacSHA256(signData, hex);
    var hashInBase64 = CryptoJS.enc.Base64.stringify(hash);
    return hashInBase64;
  },

  _errorFromHpp: function(rawHtml){
    if (typeof rawHtml !== 'string'){
      throw new TypeError('html must be provided as string.');
    }
    let reObj = />Error:\s*(.*?)<br/;
    let result = rawHtml.match(reObj);
    if (result[0]){
      return result[0];
    }
  }
};
