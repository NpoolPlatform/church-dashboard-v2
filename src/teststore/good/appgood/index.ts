import { doActionWithError } from 'npool-cli-v4'
import { defineStore } from 'pinia'
import { Good } from '../good/types'
import { API } from './const'
import { CreateAppGoodRequest, CreateAppGoodResponse, GetAppGoodsRequest, GetAppGoodsResponse, UpdateAppGoodRequest, UpdateAppGoodResponse } from './types'

export const useChurchAppGoodStore = defineStore('church-appgood-v4', {
  state: () => ({
    AppGoods: {
      AppGoods: new Map<string, Array<Good>>(),
      Total: 0
    }
  }),
  getters: {
    getGoodsByAppID () {
      return (appID: string) => {
        const data = this.AppGoods.AppGoods.get(appID)
        return !data ? [] as Array<Good> : data
      }
    }
  },
  actions: {
    getAppGoods (req: GetAppGoodsRequest, done: (appGoods: Array<Good>, error: boolean) => void) {
      doActionWithError<GetAppGoodsRequest, GetAppGoodsResponse>(
        API.GET_APPGOODS,
        req,
        req.Message,
        (resp: GetAppGoodsResponse): void => {
          const data = this.getGoodsByAppID(req.TargetAppID)
          data.push(...resp.Infos)
          this.AppGoods.AppGoods.set(req.TargetAppID, data)
          this.AppGoods.Total = resp.Total
          done(resp.Infos, false)
        }, () => {
          done([], true)
        })
    },
    updateAppGood (req: UpdateAppGoodRequest, done: (appGood: Good, error: boolean) => void) {
      doActionWithError<UpdateAppGoodRequest, UpdateAppGoodResponse>(
        API.UPDATE_APPGOOD,
        req,
        req.Message,
        (resp: UpdateAppGoodResponse): void => {
          const data = this.getGoodsByAppID(req.TargetAppID)
          const index = data.findIndex((el) => el.ID === resp.Info.ID)
          data.splice(index < 0 ? 0 : index, index < 0 ? 0 : 1, resp.Info)
          this.AppGoods.AppGoods.set(req.TargetAppID, data)
          done(resp.Info, false)
        }, () => {
          done({} as Good, true)
        })
    },
    createAppGood (req: CreateAppGoodRequest, done: (appGood: Good, error: boolean) => void) {
      doActionWithError<CreateAppGoodRequest, CreateAppGoodResponse>(
        API.CREATE_APPGOOD,
        req,
        req.Message,
        (resp: CreateAppGoodResponse): void => {
          const data = this.getGoodsByAppID(req.TargetAppID)
          data.push(resp.Info)
          this.AppGoods.AppGoods.set(req.TargetAppID, data)
          this.AppGoods.Total += 1
          done(resp.Info, false)
        }, () => {
          done({} as Good, true)
        })
    }
  }
})
