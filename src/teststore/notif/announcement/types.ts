import { BaseRequest } from 'npool-cli-v4'

/** @default "DefaultChannel" */
export enum NotifChannel {
  DefaultChannel = 'DefaultChannel',
  ChannelEmail = 'ChannelEmail',
  ChannelSMS = 'ChannelSMS',
}
export const NotifChannels = [
  NotifChannel.ChannelEmail,
  NotifChannel.ChannelSMS
]

export interface Announcement {
  ID: string;
  AppID: string;
  AppName: string;
  UserID: string;
  EmailAddress: string;
  PhoneNO: string;
  Username: string;
  Title: string;
  Content: string;
  AlreadyRead: boolean;
  AlreadySend: boolean;
  /** @format int64 */
  CreatedAt: number;
  /** if AlreadySend = true SendChannel valid */
  SendChannel: NotifChannel;
  Channels: NotifChannel[];
  /** @format int64 */
  EndAt: number;
}

export interface GetNAppAnnouncementsRequest extends BaseRequest {
  TargetAppID: string;
  /** @format int64 */
  Offset: number;
  /** @format int64 */
  Limit: number;
}

export interface GetNAppAnnouncementsResponse {
  Infos: Announcement[];
  /** @format int64 */
  Total: number;
}
