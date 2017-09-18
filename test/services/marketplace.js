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

const createAccountHolderRequest = {
  accountHolderCode: config.ACCOUNT_HOLDER_CODE,
  accountHolderDetails:{ email:"test@adyen.com"},
  legalEntity:"Individual"
};

describe('MarketPlace',()=>{
  const ady = new Adyen(config.ADYEN_CONFIG);
  describe('Account Service',()=>{
    describe('createAccountHolder',()=>{
      it('not have "InvalidFields" if created succesfully',()=>{
        return ady.MarketPlace.Account.createAccountHolder(createAccountHolderRequest)
        .then(res=>{console.log(res);return expect(res).to.exists.and.not.have.property('InvalidFields');})
        .catch(err=>{console.log(err);throw err;});
      });
    });

    describe('createAccount',()=>{
    });
    describe('deleteBankAccounts',()=>{
    });
    describe('deleteShareholders',()=>{
    });
    describe('getAccountHolder',()=>{
    });
    describe('getUploadedDocuments',()=>{
    });
    describe('suspendAccountHolder',()=>{
    });
    describe('unSuspendAccountHolder',()=>{
    });
    describe('updateAccount',()=>{
    });
    describe('updateAccountHolder',()=>{
    });
    describe('updateAccountHolderState',()=>{
    });
    describe('uploadDocument',()=>{
    });
    describe('closeAccount',()=>{
      // return expect(ady.MarketPlace.Account.closeAccount());
    });
    describe('closeAccountHolder',()=>{
    });
  });

  describe('Fund Service',()=>{
    describe('payoutAccountHolder',()=>{});
    describe('accountHolderBalance',()=>{});
    describe('accountHolderTransactionList',()=>{});
    describe('refundNotPaidOutTransfers',()=>{});
    describe('setupBenficiary',()=>{});
    describe('tranferFunds',()=>{});
  });
});
