# Adyen Nodejs API Library

## Description
This library wraps the Adyen APIs, performing some client side validation and
generally simplifies the integration.

## Requirements
* Node >=4
* Adyen account. If you don't have this you can request it here: https://www.adyen.com/home/discover/test-account-signup#form

## Installation
Clone this git repository to your project. npm access coming soon.

## QuickStart

### Initialize Adyen client
Create an adyen client. Configuration information can be provided at or after
initialization.

```js
const adyen = require('adyen');

//Config at initialization
const adyenClient = new adyen({
  user:"ws@yourcompany",
  password:"########",
  merchantAccount:"yourcompany"
});

//Config post initialization
const adyenClient2 = new adyen();
adyClient2.user = "ws@yourcompany";
adyClient2.password = "########";
adyClient2.merchantAccount = "yourcompany";

```

### Call Adyen API

Access APIs using .[service].[method] structure.
Using Adyen's /Payment/authorise results in adyenClient.Payment.authorise()
```js
const adyenClient = new adyen({
  user:"ws@yourcompany",
  password:"########",
  merchantAccount:"yourcompany"
});

adyenClient.Payment.authorise({
  amount:{
    value:100,
    currency:"EUR"
  },
  merchantAccount:TestConfig.merchantAccount,
  card:{
    number:"4111 1111 1111 1111",
    holderName:"Test Name",
    expiryMonth:"10",
    expiryYear:"2020",
    cvc:"737"
  }
}).then(adyenResult => {
  console.log(adyenResult.resultCode);
  //Authorised
  console.log(adyenResult.pspreference);
  ///8765876587658765
}).catch(err =>{
  console.log(err);
});
```

## Callbacks / Promises
Library supports callbacks and promises.

```js
const adyenClient = new adyen({
  user:"ws@yourcompany",
  password:"########",
  merchantAccount:"yourcompany"
});
adyenClient.Payment.authorise({
  amount:{
    value:100,
    currency:"EUR"
  },
  merchantAccount:TestConfig.merchantAccount,
  card:{
    number:"4111 1111 1111 1111",
    holderName:"Test Name",
    expiryMonth:"10",
    expiryYear:"2020",
    cvc:"737"
  }}, (err,result)=>{
    if (err) return console.log(err);
    console.log(adyenResult.resultCode);
    //Authorised
    console.log(adyenResult.pspreference);
    ///8765876587658765
  })

```
