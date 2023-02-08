import { BaseRequest } from 'npool-cli-v4'

/** @default "DefaultEventType" */
export enum EventType {
  DefaultEventType = 'DefaultEventType',
  WithdrawalRequest = 'WithdrawalRequest',
  WithdrawalCompleted = 'WithdrawalCompleted',
  DepositReceived = 'DepositReceived',
  KYCApproved = 'KYCApproved',
  KYCRejected = 'KYCRejected',
  Announcement = 'Announcement',
}

export const EventTypes = [
  EventType.WithdrawalRequest,
  EventType.WithdrawalCompleted,
  EventType.WithdrawalCompleted,
  EventType.DepositReceived,
  EventType.KYCApproved,
  EventType.KYCRejected,
  EventType.Announcement
]

export interface NotifTemplate {
  ID: string;
  AppID: string;
  LangID: string;
  UsedFor: EventType;
  Title: string;
  Content: string;
  Sender: string;
  /** @format int64 */
  CreatedAt: number;
  /** @format int64 */
  UpdatedAt: number;
}

export interface CreateAppNotifTemplateRequest extends BaseRequest {
  TargetAppID: string;
  TargetLangID: string;
  UsedFor: EventType;
  Title: string;
  Content: string;
  Sender: string;
}

export interface CreateAppNotifTemplateResponse {
  Info: NotifTemplate;
}

export interface GetAppNotifTemplatesRequest extends BaseRequest {
  TargetAppID: string;
  /** @format int32 */
  Offset: number;
  /** @format int32 */
  Limit: number;
}

export interface GetAppNotifTemplatesResponse {
  Infos: NotifTemplate[];
  /** @format int64 */
  Total: number;
}

export interface UpdateAppNotifTemplateRequest extends BaseRequest {
  ID: string;
  TargetAppID: string;
  TargetLangID: string;
  Title: string;
  Content: string;
  UsedFor: EventType;
  Sender: string;
}

export interface UpdateAppNotifTemplateResponse {
  Info: NotifTemplate;
}
