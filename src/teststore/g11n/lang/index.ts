import { defineStore } from 'pinia'
import { API } from './const'
import {
  GetLangsRequest,
  GetLangsResponse,
  UpdateLangRequest,
  UpdateLangResponse,
  Lang,
  CreateLangRequest,
  CreateLangResponse,
  CreateLangsRequest,
  CreateLangsResponse
} from './types'
import { doActionWithError } from 'npool-cli-v4'

export const useChurchLangStore = defineStore('church-lang-v4', {
  state: () => ({
    Lang: {
      Lang: [] as Array<Lang>,
      Total: 0
    }
  }),
  getters: {
    getLangByID () {
      return (ID: string) => {
        return this.Lang.Lang.find((el) => el.ID === ID)
      }
    }
  },
  actions: {
    getLangs (req: GetLangsRequest, done: (error: boolean, rows: Array<Lang>) => void) {
      doActionWithError<GetLangsRequest, GetLangsResponse>(
        API.GET_LANGS,
        req,
        req.Message,
        (resp: GetLangsResponse): void => {
          this.Lang.Lang.push(...resp.Infos)
          this.Lang.Total = resp.Total
          done(false, resp.Infos)
        }, () => {
          done(true, [])
        }
      )
    },
    updateLang (req: UpdateLangRequest, done: (error: boolean, row: Lang) => void) {
      doActionWithError<UpdateLangRequest, UpdateLangResponse>(
        API.UPDATE_LANG,
        req,
        req.Message,
        (resp: UpdateLangResponse): void => {
          const index = this.Lang.Lang.findIndex((el) => el.ID === resp.Info.ID)
          this.Lang.Lang.splice(index < 0 ? 0 : index, index < 0 ? 0 : 1, resp.Info)
          done(false, resp.Info)
        }, () => {
          done(true, {} as Lang)
        }
      )
    },
    createLang (req: CreateLangRequest, done: (error: boolean, row: Lang) => void) {
      doActionWithError<CreateLangRequest, CreateLangResponse>(
        API.CREATE_LANG,
        req,
        req.Message,
        (resp: CreateLangResponse): void => {
          const index = this.Lang.Lang.findIndex((el) => el.ID === resp.Info.ID)
          this.Lang.Lang.splice(index < 0 ? 0 : index, index < 0 ? 0 : 1, resp.Info)
          done(false, resp.Info)
        }, () => {
          done(true, {} as Lang)
        }
      )
    },
    createLangs (req: CreateLangsRequest, done: (error: boolean, row: Array<Lang>) => void) {
      doActionWithError<CreateLangsRequest, CreateLangsResponse>(
        API.CREATE_LANGS,
        req,
        req.Message,
        (resp: CreateLangsResponse): void => {
          resp.Infos.forEach((al) => {
            const index = this.Lang.Lang.findIndex((el) => el.ID === al.ID)
            this.Lang.Lang.splice(index < 0 ? 0 : index, index < 0 ? 0 : 1, al)
          })
          done(false, resp.Infos)
        }, () => {
          done(true, [] as Array<Lang>)
        }
      )
    }
  }
})
