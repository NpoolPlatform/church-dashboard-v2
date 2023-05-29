import { BaseRequest } from 'npool-cli-v4'

/** @default "DefaultFeedType" */
export enum CurrencyFeedType {
  DefaultFeedType = 'DefaultFeedType',
  CoinGecko = 'CoinGecko',
  CoinBase = 'CoinBase',
  StableUSDHardCode = 'StableUSDHardCode',
}

export interface Feed {
  /** @inject_tag: sql:"id" */
  ID: string;
  /** @inject_tag: sql:"coin_type_id" */
  CoinTypeID: string;
  /** @inject_tag: sql:"coin_name" */
  CoinName: string;
  /** @inject_tag: sql:"coin_unit" */
  CoinUnit: string;
  /** @inject_tag: sql:"coin_logo" */
  CoinLogo: string;
  /** @inject_tag: sql:"coin_env" */
  CoinENV: string;
  /** @inject_tag: sql:"feed_type" */
  FeedTypeStr: string;
  FeedType: CurrencyFeedType;
  /** @inject_tag: sql:"feed_coin_name" */
  FeedCoinName: string;
  /** @inject_tag: sql:"disabled" */
  Disabled: boolean;
  /**
   * @inject_tag: sql:"created_at"
   * @format int64
   */
  CreatedAt: number;
  /**
   * @inject_tag: sql:"updated_at"
   * @format int64
   */
  UpdatedAt: number;
}

export interface CreateFeedRequest extends BaseRequest {
  CoinTypeID: string;
  FeedType: CurrencyFeedType;
  FeedCoinName: string;
}

export interface CreateFeedResponse {
  Info: Feed;
}

export interface GetFeedsRequest extends BaseRequest {
  /** @format int32 */
  Offset: number;
  /** @format int32 */
  Limit: number;
}

export interface GetFeedsResponse {
  Infos: Feed[];
  /** @format int64 */
  Total: number;
}

export interface UpdateFeedRequest extends BaseRequest {
  ID: string;
  FeedCoinName: string;
  Disabled: boolean;
}

export interface UpdateFeedResponse {
  Info: Feed;
}
