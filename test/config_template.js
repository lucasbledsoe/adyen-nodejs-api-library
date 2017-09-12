var TestConfig = {
  user:"",
  password:"",
  merchantAccount:"",
  hmacKey:"",
  skinCode:"",
  marketPlaceUser:"",
  marketPlacePassword:"",
  marketPlaceMerchantAccount:""
};

TestConfig.RANDOM_INT = Math.floor(Math.random() * (1 - 9999999999)) + 1;

TestConfig.BASIC_CARD_AUTH = {
  "amount":{
    "value":100,
    "currency":"EUR"
  },
  "merchantAccount":TestConfig.merchantAccount,
  "card":{
    "number":"4111 1111 1111 1111",
    "holderName":"Test Name",
    "expiryMonth":"10",
    "expiryYear":"2020",
    "cvc":"737"
  },
  "reference":"testreference"+TestConfig.RANDOM_INT
};

TestConfig.ADYEN_CONFIG = {
  user:TestConfig.user,
  password:TestConfig.password,
  merchantAccount:TestConfig.merchantAccount,
  hmacKey:TestConfig.hmacKey,
  skinCode:TestConfig.skinCode,
  marketPlaceUser:TestConfig.marketPlaceUser,
  marketPlacePassword:TestConfig.marketPlacePassword,
};

TestConfig.SHOPPER_REFERENCE = 'shopperReference' + TestConfig.RANDOM_INT.toString();
TestConfig.ACCOUNT_HOLDER_CODE = 'ach' + TestConfig.RANDOM_INT.toString();




module.exports = TestConfig;
