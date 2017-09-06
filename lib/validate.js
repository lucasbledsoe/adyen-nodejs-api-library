'use strict';
let AdyenErrors = require('./Errors');



const ACTIONS = {
  listRecurringDetails : {
    "shopperReference":{type:"string"}
  },
  disable : {
    "shopperReference":{type:"string"}
  },
  directory : {
    currencyCode:{
      type:"string",
      length:3
    },
    paymentAmount:{
      type:"number"
    },
    merchantReference:{
      type:"string"
    },
    sessionValidity:{
      type:"string"
    },
    shipBeforeDate:{
      type:"string"
    }
  },
  skipDetails : {
    sessionValidity:{type:"string"},
    currencyCode:{type:"string"},
    paymentAmount:{type:"number"},
    merchantReference:{type:"string"},
    brandCode:{type:"string"},
    issuerId:{type:"number"}
  },
  select : {
    sessionValidity:{type:"string"},
    currencyCode:{type:"string"},
    paymentAmount:{type:"number"},
    merchantReference:{type:"string"}
  },
  authorise : {
    amount:{type:"number"},
    reference:{type:"string"}
  },
  authorise3d : {
    md:{type:"string"},
    paResponse:{type:"string"},
    browserInfo:{type:"string"}
  },
  cancel : {
    originalReference:{type:"string"}
  },
  capture : {
    modificationAmount:{type:"number"},
    originalReference:{type:"string"}
  },
  refund : {
    modificationAmount:{type:"number"},
    originalReference:{type:"string"}
  },
  cancelOrRefund : {
    originalReference:{type:"string"}
  },
  voidPendingRefund:{
    tenderReference:{type:"string"},
    uniqueTerminalId:{type:"string"}
  },
  refundWithData:{
    amount:{type:"number"},
    reference:{type:"string"}
  }
};

function validate(action, request){
  return new Promise(function(resolve,reject){
    if (typeof request === 'object' && !Array.isArray(request)){
      let missingValues = [];
      for (var key in ACTIONS[action]){
        if (!(key in request)){
          missingValues.push(key);
        }
        //TODO: Add logic to check for other validations such as length or type
      }
      if (missingValues.length === 0){
        resolve();
      } else {
        // let outputString = [];
        // for (let key in missingValues){
        //   outputString.push(key + " (" + missingValues[key].type + ")");
        // }
        reject(new AdyenErrors.InvalidRequestError("Provide the required request parameters to complete this request: "+ missingValues.join(", ")));
      }
    } else {
      reject(new TypeError("request must be an object"));
    }
  });
}

module.exports = validate;
