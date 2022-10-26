import { MyRequest, BaseRequest } from 'npool-cli-v4'

export interface Promotion {
  ID: string;
  AppID: string;
  GoodID: string;
  GoodName: string;
  Message: string;
  StartAt: number;
  EndAt: number;
  Price: string;
  Posters: string[];
  CreatedAt: number;
  UpdatedAt: number;
}

export interface CreateAppPromotionRequest extends MyRequest {
  TargetAppID: string;
  GoodID: string;
  Message: string;
  StartAt: number;
  EndAt: number;
  Price: string;
  Posters: string[];
}

export interface CreateAppPromotionResponse {
  Info: Promotion;
}

export interface GetAppPromotionsRequest extends BaseRequest{
  TargetAppID: string;
  Offset: number;
  Limit: number;
}

export interface GetAppPromotionsResponse {
  Infos: Promotion[];
  Total: number;
}

export interface UpdateAppPromotionRequest extends MyRequest {
  ID: string;
  TargetAppID: string;
  Message: string;
  StartAt: number;
  EndAt: number;
  Price: string;
  Posters: string[];
}

export interface UpdateAppPromotionResponse {
  Info: Promotion;
}
