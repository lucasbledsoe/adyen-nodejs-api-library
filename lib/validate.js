'use strict';
let AdyenErrors = require('./Errors');


const apiValues={
  amount:{type:'number'},
  brandCode:{type:"string"},
  issuerId:{type:"number"},
  currencyCode:{
    type:"string",
    length:3
  },
  paymentAmount:{
    type:"number"
  },
  modificationAmount:{type:"number"},
  merchantReference:{
    type:"string"
  },
  reference:{
    type:"string"
  },
  sessionValidity:{
    type:"string",
    validate: function(val){
      if (!(Date.parse(val))){
        throw new AdyenErrors.InvalidRequestError("Incorrect date format, should " +
          "follow ISO date time standard. Y-m-dTH:M:SZ");
      }
    }
  },
  md:{type:"string"},
  paResponse:{type:"string"},
  browserInfo:{type:"string"},
  shopperReference:{type:"string"},
  originalReference:{type:"string"},
  tenderReference:{type:"string"},
  uniqueTerminalId:{type:"string"}
};
const ACTIONS = {
  listRecurringDetails : [
    'shopperReference'
  ],
  disable : [
    'shopperReference'
  ],
  directory : [
    'currencyCode',
    'paymentAmount',
    'merchantReference',
    'sessionValidity'
  ],
  skipDetails : [
    'sessionValidity',
    'currencyCode',
    'paymentAmount',
    'merchantReference',
    'brandCode',
    'issuerId'
  ],
  select : [
    'sessionValidity',
    'currencyCode',
    'paymentAmount',
    'merchantReference'
  ],
  authorise : [
    'amount',
    'reference'
  ],
  authorise3d : [
    'md',
    'paResponse',
    'browserInfo'
  ],
  cancel : [
    'originalReference'
  ],
  capture : [
    'modificationAmount',
    'originalReference'
  ],
  refund : [
    'modificationAmount',
    'originalReference'
  ],
  cancelOrRefund : [
    'originalReference'
  ],
  voidPendingRefund:[
    'tenderReference',
    'uniqueTerminalId'
  ],
  refundWithData:[
    'amount',
    'reference'
  ]
};

function validate(action, request){
  return new Promise(function(resolve,reject){
    if (typeof request === 'object' && !Array.isArray(request)){
      if (!(ACTIONS[action])) return resolve();
      var missingValues = [];

      for (let key of ACTIONS[action]){
        if (!(key in request)){
          missingValues.push(key);
        }
        else{
          //TODO: Add logic to check for other validations such as length or type

          //error is thrown is validate fails
          if ('validate' in apiValues[key]){
            apiValues[key].validate(request[key]);
          }
        }
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
