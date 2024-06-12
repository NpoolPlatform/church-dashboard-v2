import { AppID } from './app'
import { coupon, inspiretaskconfig, inspirecoinconfig, eventinspire, notify } from 'src/npoolstore'

const _taskconfig = inspiretaskconfig.useTaskConfigStore()
export const getTaskConfigs = (offset : number, limit: number) => {
  _taskconfig.adminGetTaskConfigs({
    TargetAppID: AppID.value,
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: 'MSG_GET_TASK_CONFIGS',
        Message: 'MSG_GET_TASK_CONFIGS_FAIL',
        Popup: true,
        Type: notify.NotifyType.Error
      }
    }
  }, (error: boolean, coins?: Array<inspiretaskconfig.TaskConfig>) => {
    if (error || !coins?.length) {
      return
    }
    getTaskConfigs(offset + limit, limit)
  })
}

const event = eventinspire.useEventStore()
export const getAppEvents = (offset : number, limit: number) => {
  event.adminGetEvents({
    TargetAppID: AppID.value,
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: 'MSG_GET_EVENTS',
        Message: 'MSG_GET_EVENTS_FAIL',
        Popup: true,
        Type: notify.NotifyType.Error
      }
    }
  }, (error: boolean, descriptions?: Array<eventinspire.Event>) => {
    if (error || !descriptions?.length) {
      return
    }
    getAppEvents(offset + limit, limit)
  })
}

const _coupon = coupon.useCouponStore()
export const getCoupons = (offset: number, limit: number, type?: coupon.CouponType) => {
  _coupon.getAppCoupons({
    TargetAppID: AppID.value,
    Offset: offset,
    Limit: limit,
    CouponType: type,
    Message: {
      Error: {
        Title: 'MSG_GET_COUPONS',
        Message: 'MSG_GET_COUPONS_FAIL',
        Popup: true,
        Type: notify.NotifyType.Error
      }
    }
  }, (error: boolean, rows?: Array<coupon.Coupon>) => {
    if (error) {
      return
    }
    if (!rows?.length) {
      return
    }
    getCoupons(offset + limit, limit, type)
  })
}

const _coinconfig = inspirecoinconfig.useCoinConfigStore()
export const getCoinConfigs = (offset : number, limit: number) => {
  _coinconfig.adminGetCoinConfigs({
    TargetAppID: AppID.value,
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: 'MSG_GET_COIN_CONFIGS',
        Message: 'MSG_GET_COIN_CONFIGS_FAIL',
        Popup: true,
        Type: notify.NotifyType.Error
      }
    }
  }, (error: boolean, coins?: Array<inspirecoinconfig.CoinConfig>) => {
    if (error || !coins?.length) {
      return
    }
    getCoinConfigs(offset + limit, limit)
  })
}