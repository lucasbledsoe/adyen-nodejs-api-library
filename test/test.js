'use strict';
const Adyen = require('../lib/adyen');
const AdyenErrors = require('../lib/Errors');
const config = require('./config.js');
const AdyenUtil = require('../lib/AdyenUtil');

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const mocha = require('mocha');
const expect = chai.expect;
const describe = mocha.describe;
const it = mocha.it;
chai.use(chaiAsPromised);





describe('Create Adyen Object', ()=>{
  describe('No init', ()=>{
    const ady = new Adyen();
    it('raise APIAuthenticationError when performing auth',()=>{
      // ady.Payment.authorise(config.BASIC_CARD_AUTH).catch((err)=>{console.log(err);});
      return expect(ady.Payment.authorise(config.BASIC_CARD_AUTH)).to.eventually.be.rejectedWith(AdyenErrors.APIAuthenticationError);
    });
    it('set user and password after creation',()=>{
      ady.user = config.user;
      expect(ady.client.user).to.equal(config.user);
      ady.password = config.password;
      expect(ady.client.password).to.equal(config.password);
    });
    it('No APIAuthenticationError raised on auth request after supplying credentials',()=>{
      return expect(ady.Payment.authorise(config.BASIC_CARD_AUTH)).to.eventually.not.be.an.instanceOf(AdyenErrors.APIAuthenticationError);
    });
  });

  describe('Provide credentials on init', ()=>{
    const ady = new Adyen({user:config.user,password:config.password});
    it('set user and password set from initializing',()=>{
      expect(ady.client.user).to.equal(config.user);
      expect(ady.client.password).to.equal(config.password);
    });
    it('No APIAuthenticationError raised on auth request',()=>{
      return expect(ady.Payment.authorise(config.BASIC_CARD_AUTH)).to.eventually.not.be.an.instanceOf(AdyenErrors.APIAuthenticationError);
    });
  });

  describe('set merchantAccount in adyen object',()=>{
    const ady = new Adyen({merchantAccount:config.merchantAccount});
    expect(ady.merchantAccount).to.equal(config.merchantAccount);
  });
});

describe('Intentional Errors', ()=>{
  var ady = new Adyen(config.ADYEN_CONFIG);

  describe("InvalidRequestError on auth", () =>{
    it('when missing amount on auth',()=>{
      return expect(ady.Payment.authorise(config.BASIC_CARD_AUTH_NO_AMOUNT)).to.eventually.be.rejectedWith(AdyenErrors.InvalidRequestError);
    });
    it('when missing reference',()=>{
      return expect(ady.Payment.authorise(config.BASIC_CARD_AUTH_NO_REF)).to.eventually.be.rejectedWith(AdyenErrors.InvalidRequestError);
    });
  });
});

describe('Support Callback and Promises',()=>{
  const ady = new Adyen(config.ADYEN_CONFIG);
  it('succesful auth with promise',()=>{
    return ady.Payment.authorise(config.BASIC_CARD_AUTH)
    .then(authResult =>{
      expect(authResult).to.have.property('pspReference');
      expect(authResult).to.have.property('resultCode','Authorised');
    });
  });
  it('succesful auth with callback',()=>{
    return ady.Payment.authorise(config.BASIC_CARD_AUTH,(err, authResult)=>{
      expect(err).to.be.null;
      expect(authResult).to.have.property('pspReference');
      expect(authResult).to.have.property('resultCode','Authorised');
    });
  });
  it('error properly passed to callback',()=>{
    ady.Payment.authorise(config.BASIC_CARD_AUTH_NO_REF,(err)=>{
      expect(err).to.exist
      .and.be.instanceOf(AdyenErrors.InvalidRequestError);
    });
  });
});

describe('Payment Service', ()=>{
  var authResult = {};
  const ady = new Adyen(config.ADYEN_CONFIG);
  describe('authorise',()=>{
    const CARD_AUTH_INIT_RECUR = Object.assign({}, config.BASIC_CARD_AUTH,{
      shopperReference:config.SHOPPER_REFERENCE,
      recurring:{contract:"RECURRING"}
    });
    it('pspreference on succesful auth',()=>{
      return ady.Payment.authorise(CARD_AUTH_INIT_RECUR)
      .then(res =>{
        Object.assign(authResult, res);
        expect(authResult).to.have.property('pspReference');
        expect(authResult).to.have.property('resultCode','Authorised');
      });
    });
  });
  describe('cancel',()=>{
    it('[cancel-received] on cancel',()=>{
      return expect(ady.Payment.cancel({originalReference:authResult.pspReference}))
      .to.eventually.have.property('response','[cancel-received]');
    });
  });
  describe('refund',()=>{
    it('[refund-received] on refund',()=>{
      return expect(ady.Payment.refund({
        originalReference:authResult.pspReference,
        modificationAmount:{
          value:100,
          currency:"EUR"
        }
      })).to.eventually.have.property('response','[refund-received]');
    });
  });
  describe('capture',()=>{
    it('[capture-received] on capture',()=>{
      return expect(ady.Payment.capture({
        originalReference:authResult.pspReference,
        modificationAmount:{
          value:100,
          currency:"EUR"
        }
      })).to.eventually.have.property('response','[capture-received]');
    });
  });
  describe('cancelOrRefund',()=>{
    it('[cancelOrRefund-received] on cancelOrRefund',()=>{
      return expect(ady.Payment.cancelOrRefund({originalReference:authResult.pspReference}))
      .to.eventually.have.property('response','[cancelOrRefund-received]');
    });
  });
  describe('refundWithData',()=>{
    it('pspreference on succesful refundWithData',()=>{
      return ady.Payment.refundWithData(config.BASIC_CARD_AUTH)
      .then(res =>{
        Object.assign(authResult, res);
        expect(authResult).to.have.property('pspReference');
      });
    });
  });
});

describe('HPP Service', () => {
  const ady = new Adyen(config.ADYEN_CONFIG);
  describe('generate256HMAC', () => {
    it('generate accurate hmac matching 4xaTVPW+C0tOErcNsz/8cblg0JVxPYZzqtAJ0LIYsUI=', ()=>{
      const request = {
        countryCode : 'US',
        currencyCode : 'EUR',
        merchantReference : 'TEST-PAYMENT',
        paymentAmount : '199',
        sessionValidity : '2100-01-01T00:00:00+00:00',
        shopperLocale : 'en_US',
        merchantAccount : config.merchantAccount,
        skinCode: config.skinCode
      };
      expect(AdyenUtil.generate256HMAC(request, config.hmacKey)).to.equal("4xaTVPW+C0tOErcNsz/8cblg0JVxPYZzqtAJ0LIYsUI=");
    });
  });
  describe('directoryLookup', () => {
    it('return list of valid payment methods', ()=>{
      const request = {
        countryCode : 'US',
        currencyCode : 'EUR',
        merchantReference : 'TEST-PAYMENT',
        paymentAmount : '199',
        sessionValidity : '2100-01-01T00:00:00+00:00',
        shopperLocale : 'en_US'
      };
      return expect(ady.HPP.directoryLookup(request)).to.eventually.have.property("paymentMethods");
    });
  });
});

describe('Checkout Service', ()=>{
  var authResult = {};
  const ady = new Adyen(config.ADYEN_CONFIG);
  describe('payments',()=>{
    const CARD_AUTH_INIT_RECUR_CHECKOUT = Object.assign({}, config.BASIC_CARD_AUTH_CHECKOUT,{
      shopperReference:config.SHOPPER_REFERENCE,
    });
    it('pspreference on succesful auth',()=>{
      return ady.Checkout.payments(CARD_AUTH_INIT_RECUR_CHECKOUT)
      .then(res =>{
        Object.assign(authResult, res);
        expect(authResult).to.have.property('pspReference');
        expect(authResult).to.have.property('resultCode','Authorised');
      });
    });
  });
});

describe('Recurring Service',()=>{
  const ady = new Adyen(config.ADYEN_CONFIG);
  describe('listRecurringDetails',()=>{
    it('return minimal object when invalid shopperReference',()=>{
      return expect(ady.Recurring.listRecurringDetails({shopperReference:'nonexistantshopperReference'}))
        .to.eventually.have.property('invalidOneclickContracts','false');
    });

    it('return details when shopperReference present',()=>{
      return ady.Recurring.listRecurringDetails({shopperReference:config.SHOPPER_REFERENCE})
      .then(adyenResult=>{
        return expect(adyenResult).have.property('details');
      });
    });
  });
  describe('disable',()=>{
    it('return [all-details-successfully-disabled] on succesful disable',()=>{
      return expect(ady.Recurring.disable({shopperReference:config.SHOPPER_REFERENCE}))
        .to.eventually.have.property('response', '[all-details-successfully-disabled]');
    });
  });
});

/*
describe('Payout Service',()=>{
  const ady = new Adyen(config.ADYEN_CONFIG);
  const SDASRequest = {
      "amount" : {
          "currency" : "EUR",
          "value" : "1000"
      },

      "bank": {
          "bankName": "AbnAmro",
          "bic": "ABNANL2A",
          "countryCode": "NL",
          "iban": "NL32ABNA0515071439",
          "ownerName": "Adyen",
          "bankCity": "Amsterdam",
          "taxId":"bankTaxId"
      },

      "merchantAccount" : "TestMerchant",

      "recurring" : {
          "contract" : "PAYOUT"
      },

      "reference" : 'merchantReference' + config.RANDOM_INT,
      "shopperEmail" : "shopper@email.com",
      "shopperReference" : config.SHOPPER_REFERENCE,
      "shopperName" : {
          "firstName" : "Adyen",
          "gender" : "MALE",
          "lastName" : "Test"
      },
      "dateOfBirth" : "1990-01-01",
      "entityType" : "Company",
      "nationality" : "NL",

      "billingAddress": {
          "houseNumberOrName":"17",
          "street":"Teststreet 1",
          "city":"Amsterdam",
          "stateOrProvince":"NY",
          "country" : "US",
          "postalCode":"12345"
      }
  };
  const SDRequest = {
      "recurring" : {
        "contract" : "PAYOUT"
    },

    "bank": {
        "bankName": "AbnAmro",
        "bic": "ABNANL2A",
        "countryCode": "NL",
        "iban": "NL32ABNA0515071439",
        "ownerName": "Adyen",
        "bankCity": "Amsterdam",
        "taxId":"bankTaxId"
    },

    "shopperEmail" : "shopper@email.com",
    "shopperReference" : config.SHOPPER_REFERENCE,
    "shopperName" : {
        "firstName" : "Adyen",
        "gender" : "MALE",
        "lastName" : "Test"
    },
    "dateOfBirth" : "1990-01-01",
    "entityType" : "Company",
    "nationality" : "NL",

    "billingAddress": {
        "houseNumberOrName":"17",
        "street":"Teststreet 1",
        "city":"Amsterdam",
        "stateOrProvince":"NY",
        "country" : "US",
        "postalCode":"12345"
    }
  };
  var psp = '';
  describe('storeDetailAndSubmitThirdParty',()=>{
    it('return [payout-submit-received]',()=>{
      return ady.Payout.storeDetailAndSubmitThirdParty(SDASRequest)
      .then((adyenResult)=>{
        psp = adyenResult.pspReference;
        return expect(adyenResult).to.have.property('resultCode','[payout-submit-received]');
      });
    });
  });
  describe('confirmThirdParty',()=>{
    it('return [payout-confirm-received]',()=>{
      return expect(ady.Payots.confirmThirdParty({originalReference:psp}))
      .to.eventually.have.property('resultCode', '[payout-confirm-received]');
    });
  });
  describe('submitThirdParty',()=>{
    return expect(ady.Payout.submitThirdParty())

  });
  describe('confirmThirdParty',()=>{});
  describe('declineThirdParty',()=>{});
  describe('storeDetail',()=>{});
  describe('storeDetailAndSubmit',()=>{});
  describe('submit',()=>{});
  describe('confirm',()=>{});
  describe('decline',()=>{});
});
*/
