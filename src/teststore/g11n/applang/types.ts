import { BaseRequest } from 'npool-cli-v4'

export interface AppLang {
  ID: string;
  AppID: string;
  AppName: string;
  LangID: string;
  Lang: string;
  Logo: string;
  Name: string;
  Short: string;
  Main: boolean;
  CreatedAt: number;
  UpdatedAt: number;
}

export interface CreateAppLangRequest extends BaseRequest {
  TargetAppID: string;
  TargetLangID: string;
  Main: boolean;
}

export interface CreateAppLangResponse {
  Info: AppLang;
}

export interface DeleteAppLangRequest extends BaseRequest {
  ID: string;
  TargetAppID: string;
}

export interface DeleteAppLangResponse {
  Info: AppLang;
}

export interface GetAppLangsRequest extends BaseRequest {
  TargetAppID: string;
  Offset: number;
  Limit: number;
}

export interface GetAppLangsResponse {
  Infos: AppLang[];
  Total: number;
}
