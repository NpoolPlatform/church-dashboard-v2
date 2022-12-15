import { BaseRequest } from 'npool-cli-v4'

export interface AppCountry {
  ID: string;
  AppID: string;
  AppName: string;
  CountryID: string;
  Country: string;
  Flag: string;
  Code: string;
  Short: string;
  CreatedAt: number;
  UpdatedAt: number;
}
export interface CreateAppCountryRequest extends BaseRequest {
  TargetAppID: string;
  CountryID: string;
}

export interface CreateAppCountryResponse {
  Info: AppCountry;
}

export interface DeleteAppCountryRequest extends BaseRequest {
  ID: string;
  TargetAppID: string;
}

export interface DeleteAppCountryResponse {
  Info: AppCountry;
}

export interface GetAppAppCountriesRequest extends BaseRequest {
  TargetAppID: string;
  Offset: number;
  Limit: number;
}

export interface GetAppAppCountriesResponse {
  Infos: AppCountry[];
  Total: number;
}
