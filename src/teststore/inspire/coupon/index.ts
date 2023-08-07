import { defineStore } from 'pinia'
import { API } from './const'
import {
  GetAppCouponsRequest,
  GetAppCouponsResponse,
  CreateCouponRequest,
  CreateCouponResponse,
  Coupon,
  GetCouponsRequest,
  GetCouponsResponse,
  UpdateCouponRequest,
  UpdateCouponResponse,
  CouponType
} from './types'
import { doActionWithError } from 'npool-cli-v4'

export const useCouponStore = defineStore('coupon-pool', {
  state: () => ({
    Coupons: new Map<string, Array<Coupon>>(),
    MyCoupons: [] as Array<Coupon>
  }),
  getters: {
    coupons (): (appID: string, couponType?: CouponType) => Array<Coupon> {
      return (appID: string, couponType?: CouponType) => {
        const coupons = this.Coupons.get(appID)
        if (!coupons) {
          return []
        }
        if (!couponType) {
          return coupons
        }
        return coupons.filter((el) => el.CouponType === couponType)
      }
    }
  },
  actions: {
    getAppCoupons (req: GetAppCouponsRequest, done: (error: boolean, rows: Array<Coupon>) => void) {
      doActionWithError<GetAppCouponsRequest, GetAppCouponsResponse>(
        API.GET_APP_COUPONPOOLS,
        req,
        req.Message,
        (resp: GetAppCouponsResponse): void => {
          let coupons = this.Coupons.get(req.TargetAppID)
          if (!coupons) {
            coupons = [] as Array<Coupon>
          }
          coupons.push(...resp.Infos)
          this.Coupons.set(req.TargetAppID, coupons)
          done(false, resp.Infos)
        }, () => {
          done(true, [] as Array<Coupon>)
        }
      )
    },
    getCoupons (req: GetCouponsRequest, done: (error: boolean, rows: Array<Coupon>) => void) {
      doActionWithError<GetCouponsRequest, GetCouponsResponse>(
        API.GET_COUPONPOOLS,
        req,
        req.Message,
        (resp: GetCouponsResponse): void => {
          this.MyCoupons.push(...resp.Infos)
          done(false, resp.Infos)
        }, () => {
          done(true, [] as Array<Coupon>)
        }
      )
    },
    createCoupon (req: CreateCouponRequest, done: (error: boolean, row: Coupon) => void) {
      doActionWithError<CreateCouponRequest, CreateCouponResponse>(
        API.CREATE_COUPONPOOL,
        req,
        req.NotifyMessage,
        (resp: CreateCouponResponse): void => {
          let coupons = this.Coupons.get(req.TargetAppID)
          if (!coupons) {
            coupons = [] as Array<Coupon>
          }
          coupons.push(resp.Info)
          this.Coupons.set(req.TargetAppID, coupons)
          done(false, resp.Info)
        }, () => {
          done(true, {} as Coupon)
        }
      )
    },
    updateCoupon (req: UpdateCouponRequest, done: (error: boolean, row: Coupon) => void) {
      doActionWithError<UpdateCouponRequest, UpdateCouponResponse>(
        API.UPDATE_COUPONPOOL,
        req,
        req.NotifyMessage,
        (resp: UpdateCouponResponse): void => {
          let coupons = this.Coupons.get(req.TargetAppID)
          if (!coupons) {
            coupons = [] as Array<Coupon>
          }
          const index = coupons.findIndex((el) => el.ID === resp.Info.ID)
          coupons.splice(index >= 0 ? index : 0, index >= 0 ? 1 : 0, resp.Info)
          this.Coupons.set(req.TargetAppID, coupons)
          done(false, resp.Info)
        }, () => {
          done(true, {} as Coupon)
        }
      )
    }
  }
})

export * from './types'
