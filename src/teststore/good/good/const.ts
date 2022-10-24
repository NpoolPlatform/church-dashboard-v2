export enum API {
  GET_GOODS = '/good/v1/get/goods',
  GET_GOOD = '/good/v1/get/good',
  CREATE_GOOD = '/good/v1/create/good',
  UPDATE_GOOD = '/good/v1/update/good',
}

export enum BenefitType {
  DefaultBenefitType = 'DefaultBenefitType',
  BenefitTypePlatform = 'BenefitTypePlatform',
  BenefitTypePool = 'BenefitTypePool',
}

export enum GoodType {
  DefaultGoodType = 'DefaultGoodType',
  GoodTypeClassicMining = 'GoodTypeClassicMining',
  GoodTypeUnionMining = 'GoodTypeUnionMining',
  GoodTypeTechniqueFee = 'GoodTypeTechniqueFee',
  GoodTypeElectricityFee = 'GoodTypeElectricityFee',
}
