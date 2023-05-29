import { defineStore } from 'pinia'
import { API } from './const'
import {
  Currency,
  GetCurrencyHistoriesRequest,
  GetCurrencyHistoriesResponse
} from './types'
import { doActionWithError } from 'npool-cli-v4'

export const useCurrencyHistoriesStore = defineStore('currencyhistories-v4', {
  state: () => ({
    CurrencyHistories: {
      CurrencyHistories: [] as Array<Currency>,
      Total: 0
    }
  }),
  getters: {
  },
  actions: {
    getCurrencyHistories (req: GetCurrencyHistoriesRequest, done: (error: boolean, rows: Array<Currency>) => void) {
      doActionWithError<GetCurrencyHistoriesRequest, GetCurrencyHistoriesResponse>(
        API.GET_HISTORIES,
        req,
        req.Message,
        (resp: GetCurrencyHistoriesResponse): void => {
          this.CurrencyHistories.CurrencyHistories.push(...resp.Infos)
          this.CurrencyHistories.Total = resp.Total
          done(false, resp.Infos)
        }, () => {
          done(true, [] as Array<Currency>)
        }
      )
    }
  }
})
