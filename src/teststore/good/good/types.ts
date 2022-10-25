import { BaseRequest } from 'npool-cli-v4'
import { BenefitType, GoodType } from './const'

export interface GoodCoinInfo {
  CoinTypeID: string;
  CoinLogo: string;
  CoinName: string;
  CoinUnit: string;
  CoinPreSale: boolean;
}

export interface Good {
  ID: string;
  DeviceInfoID: string;
  DeviceType: string;
  DeviceManufacturer: string;
  DevicePowerComsuption: number;
  DeviceShipmentAt: number;
  DevicePosters: string[];
  DurationDays: number;
  CoinTypeID: string;
  CoinLogo: string;
  CoinName: string;
  CoinUnit: string;
  CoinPreSale: boolean;
  InheritFromGoodID: string;
  InheritFromGoodName: string;
  InheritFromGoodType: GoodType;
  InheritFromGoodBenefitType: BenefitType;
  VendorLocationID: string;
  VendorLocationCountry: string;
  VendorLocationProvince: string;
  VendorLocationCity: string;
  VendorLocationAddress: string;
  GoodType: GoodType;
  BenefitType: BenefitType;
  Price: string;
  Title: string;
  Unit: string;
  UnitAmount: number;
  TestOnly: boolean;
  Posters: string[];
  Labels: string[];
  VoteCount: number;
  Rating: number;
  SupportCoins: GoodCoinInfo[];
  SupportCoinTypeIDs: string[];
  GoodStockID: string;
  Total: number;
  Locked: number;
  InService: number;
  Sold: number;
  DeliveryAt: number;
  StartAt: number;
  CreatedAt: number;
  UpdatedAt: number;
  DeletedAt: number;
}

export interface CreateGoodRequest extends BaseRequest {
  DeviceInfoID: string;
  DurationDays: number;
  CoinTypeID: string;
  InheritFromGoodID?: string;
  VendorLocationID: string;
  Price: string;
  BenefitType: string;
  GoodType: string;
  Title: string;
  Unit: string;
  UnitAmount: number;
  SupportCoinTypeIDs: string[];
  DeliveryAt: number;
  StartAt: number;
  TestOnly: boolean;
  Total: number;
  Locked: number;
  InService: number;
  Sold: number;
  Posters: string[];
  Labels: string[];
}

export interface CreateGoodResponse {
  Info: Good
}

export interface GetGoodsRequest extends BaseRequest{
  Offset: number
  Limit: number
}

export interface GetGoodsResponse {
  Infos: Array<Good>
  Total: number
}

export interface GetGoodRequest extends BaseRequest {
  ID: string
}

export interface GetGoodResponse {
  Info: Good
}

export interface UpdateGoodRequest extends BaseRequest{
  ID: string;
  DeviceInfoID: string;
  DurationDays: number;
  CoinTypeID: string;
  InheritFromGoodID: string;
  VendorLocationID: string;
  Price: string;
  Title: string;
  Unit: string;
  UnitAmount: number;
  SupportCoinTypeIDs: string[];
  DeliveryAt: number;
  StartAt: number;
  TestOnly: boolean;
  Total: number;
  Sold: number;
  Posters: string[];
  Labels: string[];
}

export interface UpdateGoodResponse {
  Info: Good
}
