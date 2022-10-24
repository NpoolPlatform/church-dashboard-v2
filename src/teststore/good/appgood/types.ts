import { BaseRequest } from 'npool-cli-v4'
import { Good } from '../good/types'

export interface GetAppGoodsRequest extends BaseRequest {
  TargetAppID: string;
  Offset: number;
  Limit: number;
}

export interface GetAppGoodsResponse {
  Infos: Good[];
  Total: number;
}

export interface UpdateAppGoodRequest extends BaseRequest {
  ID: string;
  TargetAppID: string;
  Online: boolean;
  Visible: boolean;
  Goodame: string;
  Price: string;
  DisplayIndex: number;
  PurchaseLimit: number;
  CommissionPercent: number;
}

export interface UpdateAppGoodResponse {
  Info: Good;
}

export interface CreateAppGoodRequest extends BaseRequest{
  TargetAppID: string;
  GoodID: string;
  Online: boolean;
  Visible: boolean;
  Goodame: string;
  Price: string;
  DisplayIndex: number;
  PurchaseLimit: number;
  CommissionPercent: number;
}

export interface CreateAppGoodResponse {
  Info: Good;
}
