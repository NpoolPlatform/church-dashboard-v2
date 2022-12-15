import { MyRequest } from 'npool-cli-v4'

export interface Message {
  ID: string;
  AppName: string;
  Lang: string;
  MessageID: string;
  Message: string;
  GetIndex: number;
  Disabled: boolean;
  CreatedAt: number;
  UpdatedAt: number;
}

export interface MessageReq {
  ID: string;
  AppID: string;
  LangID: string;
  MessageID: string;
  Message: string;
  GetIndex: number;
  Disabled: boolean;
}

export interface CreateAppMessageRequest extends MyRequest {
  AppID: string;
  TargetAppID: string;
  TargetLangID: string;
  MessageID: string;
  Message: string;
  GetIndex: number;
}

export interface CreateAppMessageResponse {
  Info: Message;
}

export interface CreateAppMessagesRequest extends MyRequest {
  TargetAppID: string;
  TargetLangID: string;
  Infos: MessageReq[];
}

export interface CreateAppMessagesResponse {
  TargetAppID: string;
  TargetLangID: string;
  Infos: Message[];
}

export interface DeleteAppMessageRequest extends MyRequest {
  ID: string;
  TargetAppID: string;
}

export interface DeleteAppMessageResponse {
  Info: Message;
}

export interface GetAppMessagesRequest extends MyRequest {
  AppID: string;
  TargetAppID: string;
  Disabled: boolean;
  Offset: number;
  Limit: number;
}

export interface GetAppMessagesResponse {
  Infos: Message[];
  Total: number;
}

export interface UpdateAppMessageRequest extends MyRequest {
  ID: string;
  AppID: string;
  TargetAppID: string;
  TargetLangID: string;
  MessageID: string;
  Message: string;
  GetIndex: number;
  Disabled: boolean;
}

export interface UpdateAppMessageResponse {
  Info: Message;
}
