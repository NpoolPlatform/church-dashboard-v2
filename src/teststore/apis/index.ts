import { defineStore } from 'pinia'
import { APIS as APIEnum } from './const'
import { API, GetAPIsRequest, GetAPIsResponse, UpdateAPIRequest, UpdateAPIResponse } from './types'
import { doActionWithError } from 'npool-cli-v4'

export const useChurchAPIStore = defineStore('church-apis-v4', {
  state: () => ({
    APIs: {
      APIs: [] as Array<API>,
      Total: 0
    }
  }),
  getters: {
  },
  actions: {
    getAPIs (req: GetAPIsRequest, done: (error: boolean, rows: Array<API>) => void) {
      doActionWithError<GetAPIsRequest, GetAPIsResponse>(
        APIEnum.GET_APIS,
        req,
        req.Message,
        (resp: GetAPIsResponse): void => {
          this.APIs.APIs.push(...resp.Infos)
          this.APIs.Total = resp.Total
          done(false, resp.Infos)
        }, () => {
          done(true, [] as Array<API>)
        }
      )
    },
    updateAPI (req: UpdateAPIRequest, done: (error: boolean, row: API) => void) {
      doActionWithError<UpdateAPIRequest, UpdateAPIResponse>(
        APIEnum.UPDATE_API,
        req,
        req.Message,
        (resp: UpdateAPIResponse): void => {
          const index = this.APIs.APIs.findIndex((el) => el.ID === resp.Info.ID)
          this.APIs.APIs.splice(index < 0 ? 0 : index, index < 0 ? 0 : 1, resp.Info)
          done(false, resp.Info)
        }, () => {
          done(true, {} as API)
        }
      )
    }
  }
})
