import { BaseRequest } from 'npool-cli-v4'

/** @default "DefaultFeedType" */
export enum CurrencyFeedType {
  DefaultFeedType = 'DefaultFeedType',
  CoinGecko = 'CoinGecko',
  CoinBase = 'CoinBase',
  StableUSDHardCode = 'StableUSDHardCode',
}

export interface Currency {
  /** @inject_tag: sql:"id" */
  ID: string;
  /** @inject_tag: sql:"coin_type_id" */
  CoinTypeID: string;
  /** @inject_tag: sql:"coin_name" */
  CoinName: string;
  /** @inject_tag: sql:"coin_logo" */
  CoinLogo: string;
  /** @inject_tag: sql:"coin_unit" */
  CoinUnit: string;
  /** @inject_tag: sql:"coin_env" */
  CoinENV: string;
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
  /** @inject_tag: sql:"market_value_high" */
  MarketValueHigh: string;
  /** @inject_tag: sql:"market_value_low" */
  MarketValueLow: string;
  /** @inject_tag: sql:"feed_type" */
  FeedTypeStr: string;
  FeedType: CurrencyFeedType;
}

export interface GetCurrencyHistoriesRequest extends BaseRequest {
  CoinTypeIDs: string[];
  /** @format int64 */
  StartAt: number;
  /** @format int64 */
  EndAt: number;
  /** @format int32 */
  Offset: number;
  /** @format int32 */
  Limit: number;
}

export interface GetCurrencyHistoriesResponse extends BaseRequest {
  Infos: Currency[];
  /** @format int64 */
  Total: number;
}
