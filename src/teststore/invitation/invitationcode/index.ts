import { defineStore } from 'pinia'
import { API } from './const'
import {
  CreateInvitationCodeRequest,
  CreateInvitationCodeResponse,
  InvitationCode,
  GetAppInvitationCodesRequest,
  GetAppInvitationCodesResponse,
  GetInvitationCodesRequest,
  GetInvitationCodesResponse
} from './types'
import { doActionWithError } from 'npool-cli-v4'

export const useChurchInvitationCodeStore = defineStore('church-commission-v4', {
  state: () => ({
    InvitationCodes: {
      InvitationCodes: [] as Array<InvitationCode>,
      Total: 0
    }
  }),
  getters: {
  },
  actions: {
    getAppInvitationCodes (req: GetAppInvitationCodesRequest, done: (error: boolean, rows: Array<InvitationCode>) => void) {
      doActionWithError<GetAppInvitationCodesRequest, GetAppInvitationCodesResponse>(
        API.GET_APP_INVITATIONCODES,
        req,
        req.Message,
        (resp: GetAppInvitationCodesResponse): void => {
          this.InvitationCodes.InvitationCodes.push(...resp.Infos)
          this.InvitationCodes.Total = resp.Total
          done(false, resp.Infos)
        }, () => {
          done(true, [] as Array<InvitationCode>)
        }
      )
    },
    getInvitationCodes (req: GetInvitationCodesRequest, done: (error: boolean, rows: Array<InvitationCode>) => void) {
      doActionWithError<GetInvitationCodesRequest, GetInvitationCodesResponse>(
        API.GET_INVITATIONCODES,
        req,
        req.Message,
        (resp: GetInvitationCodesResponse): void => {
          this.InvitationCodes.InvitationCodes.push(...resp.Infos)
          this.InvitationCodes.Total = resp.Total
          done(false, resp.Infos)
        }, () => {
          done(true, [] as Array<InvitationCode>)
        }
      )
    },
    createInvitationCode (req: CreateInvitationCodeRequest, done: (error: boolean, row: InvitationCode) => void) {
      doActionWithError<CreateInvitationCodeRequest, CreateInvitationCodeResponse>(
        API.CREATE_INVITATIONCODE,
        req,
        req.Message,
        (resp: CreateInvitationCodeResponse): void => {
          this.InvitationCodes.InvitationCodes.push(resp.Info)
          this.InvitationCodes.Total += 1
          done(false, resp.Info)
        }, () => {
          done(true, {} as InvitationCode)
        }
      )
    }
  }
})
