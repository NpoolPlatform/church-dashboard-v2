import { BaseRequest } from 'npool-cli-v4'

export interface InvitationCode {
  AppID: string;
  UserID: string;
  EmailAddress: string;
  PhoneNO: string;
  Username: string;
  InvitationCode: string;
  Confirmed: boolean;
  Disabled: boolean;
  /** @format int64 */
  CreatedAt: number;
  /** @format int64 */
  UpdatedAt: number;
}

export interface CreateInvitationCodeRequest extends BaseRequest {
  TargetUserID: string;
}

export interface CreateInvitationCodeResponse {
  Info: InvitationCode;
}

export interface GetAppInvitationCodesRequest extends BaseRequest {
  TargetAppID: string;
  /** @format int32 */
  Offset: number;
  /** @format int32 */
  Limit: number;
}

export interface GetAppInvitationCodesResponse {
  Infos: InvitationCode[];
  /** @format int64 */
  Total: number;
}

export interface GetInvitationCodesRequest extends BaseRequest {
  /** @format int32 */
  Offset: number;
  /** @format int32 */
  Limit: number;
}

export interface GetInvitationCodesResponse {
  Infos: InvitationCode[];
  /** @format int64 */
  Total: number;
}
