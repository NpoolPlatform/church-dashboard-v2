import { MyRequest, BaseRequest } from 'npool-cli-v4'

export interface Recommend {
  ID: string;
  AppID: string;
  GoodID: string;
  GoodName: string;
  RecommenderID: string;
  RecommenderUsername: string;
  RecommenderFirstName: string;
  RecommenderLastName: string;
  RecommenderEmailAddress: string;
  RecommenderPhoneNo: string;
  Message: string;
  RecommendIndex: number;
  CreatedAt: number;
  UpdatedAt: number;
}

export interface CreateAppRecommendRequest extends MyRequest {
  TargetAppID: string;
  GoodID: string;
  RecommenderID: string;
  Message: string;
  RecommendIndex: number;
}

export interface CreateAppRecommendResponse {
  Info: Recommend;
}

export interface CreateRecommendRequest extends MyRequest {
  AppID: string;
  GoodID: string;
  RecommenderID: string;
  Message: string;
  RecommendIndex: number;
}

export interface CreateRecommendResponse {
  Info: Recommend;
}

export interface GetAppRecommendsRequest extends BaseRequest {
  TargetAppID: string;
  Offset: number;
  Limit: number;
}

export interface GetAppRecommendsResponse {
  Infos: Recommend[];
  Total: number;
}

export interface UpdateAppRecommendRequest extends MyRequest {
  ID: string;
  TargetAppID: string;
  Message: string;
  RecommendIndex: number;
}

export interface UpdateAppRecommendResponse {
  Info: Recommend;
}
