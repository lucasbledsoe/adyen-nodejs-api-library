'use strict';
const Adyen = require('../../lib/adyen');
const config = require('../config');
// const AdyenErrors = require('../lib/Errors');

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const mocha = require('mocha');
const expect = chai.expect;
const describe = mocha.describe;
const it = mocha.it;
chai.use(chaiAsPromised);


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

  // describe('payments.details',()=>{
  //   const CARD_AUTH_INIT_RECUR_CHECKOUT = Object.assign({}, config.BASIC_CARD_AUTH_CHECKOUT,{
  //     shopperReference:config.SHOPPER_REFERENCE,
  //   });
  //   it('pspreference on succesful auth',()=>{
  //     return ady.Checkout.payments.details(CARD_AUTH_INIT_RECUR_CHECKOUT)
  //     .then(res =>{
  //       Object.assign(authResult, res);
  //       expect(authResult).to.have.property('pspReference');
  //       expect(authResult).to.have.property('resultCode','Authorised');
  //     });
  //   });
  // });
});
