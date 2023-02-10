import { BaseRequest } from 'npool-cli-v4'

/** @default "DefaultAnnouncementType" */
export enum AnnouncementType {
  DefaultAnnouncementType = 'DefaultAnnouncementType',
  AllUsers = 'AllUsers',
  AppointUsers = 'AppointUsers',
}

export interface AnnouncementUser {
  ID: string;
  AnnouncementID: string;
  AppID: string;
  AppName: string;
  UserID: string;
  EmailAddress: string;
  PhoneNO: string;
  Username: string;
  Title: string;
  Content: string;
  AnnouncementType: AnnouncementType;
  /** @format int64 */
  CreatedAt: number;
  /** @format int64 */
  UpdatedAt: number;
}

export interface CreateAnnouncementUsersRequest {
  AppID: string;
  UserIDs: string[];
  AnnouncementID: string;
}

export type CreateAnnouncementUsersResponse = object;

export interface DeleteAnnouncementUserRequest {
  ID: string;
}

export type DeleteAnnouncementUserResponse = object;

export interface GetAnnouncementUsersRequest {
  AppID: string;
  AnnouncementID: string;
  /** @format int64 */
  Offset: number;
  /** @format int64 */
  Limit: number;
}

export interface GetAnnouncementUsersResponse {
  Infos: AnnouncementUser[];
  /** @format int64 */
  Total: number;
}

export interface GetAppAnnouncementUsersRequest {
  AppID: string;
  /** @format int64 */
  Offset: number;
  /** @format int64 */
  Limit: number;
}

export interface GetAppAnnouncementUsersResponse {
  Infos: AnnouncementUser[];
  /** @format int64 */
  Total: number;
}

export interface GetNAppAnnouncementUsersRequest extends BaseRequest {
  TargetAppID: string;
  /** @format int64 */
  Offset: number;
  /** @format int64 */
  Limit: number;
}

export interface GetNAppAnnouncementUsersResponse {
  Infos: AnnouncementUser[];
  /** @format int64 */
  Total: number;
}
