import { BaseRequest } from 'npool-cli-v4'
import { BenefitType, GoodType } from '../good/const'
import { Good, GoodCoinInfo } from '../good/types'

export interface AppGood {
  ID: string;
  AppID: string;
  GoodID: string;
  Online: boolean;
  Visible: boolean;
  Price: string;
  DisplayIndex: number;
  PurchaseLimit: number;
  CommissionPercent: number;
  PromotionStartAt: number;
  PromotionEndAt: number;
  PromotionMessage: string;
  PromotionPrice: string;
  PromotionPosters: string[];
  RecommenderID: string;
  RecommenderEmailAddress: string;
  RecommenderPhoneNO: string;
  RecommenderUsername: string;
  RecommenderFirstName: string;
  RecommenderLastName: string;
  RecommendMessage: string;
  RecommendIndex: number;
  RecommendAt: number;
  DeviceType: string;
  DeviceManufacturer: string;
  DevicePowerComsuption: number;
  DeviceShipmentAt: number;
  DevicePosters: string[];
  DurationDays: number;
  VendorLocationCountry: string;
  CoinTypeID: string;
  CoinLogo: string;
  CoinName: string;
  CoinUnit: string;
  CoinPreSale: boolean;
  GoodType: GoodType;
  BenefitType: BenefitType;
  GoodName: string;
  Unit: string;
  UnitAmount: number;
  TestOnly: boolean;
  Posters: string[];
  Labels: string[];
  VoteCount: number;
  Rating: number;
  SupportCoins: GoodCoinInfo[];
  GoodTotal: number;
  Locked: number;
  InService: number;
  Sold: number;
  SubGoods: Good[];
  Must: boolean;
  Commission: boolean;
  StartAt: number;
  CreatedAt: number;
}

export interface GetAppGoodsRequest extends BaseRequest {
  TargetAppID: string;
  Offset: number;
  Limit: number;
}

export interface GetAppGoodsResponse {
  Infos: AppGood[];
  Total: number;
}

export interface UpdateAppGoodRequest extends BaseRequest {
  ID: string;
  TargetAppID: string;
  Online: boolean;
  Visible: boolean;
  GoodName: string;
  Price: string;
  DisplayIndex: number;
  PurchaseLimit: number;
  CommissionPercent: number;
}

export interface UpdateAppGoodResponse {
  Info: AppGood;
}

export interface CreateAppGoodRequest extends BaseRequest{
  TargetAppID: string;
  GoodID: string;
  Online: boolean;
  Visible: boolean;
  GoodName: string;
  Price: string;
  DisplayIndex: number;
  PurchaseLimit: number;
  CommissionPercent: number;
}

export interface CreateAppGoodResponse {
  Info: AppGood;
}
