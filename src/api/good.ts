import { AppGood, DeviceInfo, Good, NotifyType, Promotion, Recommend, useChurchAppGoodStore, useChurchDeviceInfoStore, useChurchGoodStore, useChurchPromotionStore, useChurchRecommendStore } from 'npool-cli-v4'
import { AppID } from './app'

const good = useChurchGoodStore()

export const getGoods = (offset: number, limit: number) => {
  good.getGoods({
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: 'MSG_GET_GOODS',
        Message: 'MSG_GET_GOODS_FAIL',
        Popup: true,
        Type: NotifyType.Error
      }
    }
  }, (goods: Array<Good>, error: boolean) => {
    if (error || goods.length < limit) {
      return
    }
    getGoods(offset + limit, limit)
  })
}

const appGood = useChurchAppGoodStore()
export const getAppGoods = (offset: number, limit: number) => {
  appGood.getAppGoods({
    Offset: offset,
    Limit: limit,
    TargetAppID: AppID.value,
    Message: {
      Error: {
        Title: 'MSG_GET_APP_GOODS',
        Message: 'MSG_GET_APP_GOODS_FAIL',
        Popup: true,
        Type: NotifyType.Error
      }
    }
  }, (goods: Array<AppGood>, error: boolean) => {
    if (error || goods.length < limit) {
      return
    }
    getAppGoods(offset + limit, limit)
  })
}

const promotion = useChurchPromotionStore()
export const getAppPromotions = (offset: number, limit: number) => {
  promotion.getAppPromotions({
    Offset: offset,
    Limit: limit,
    TargetAppID: AppID.value,
    Message: {
      Error: {
        Title: 'MSG_GET_GOOD_PROMOTIONS',
        Message: 'MSG_GET_GOOD_PROMOTIONS_FAIL',
        Popup: true,
        Type: NotifyType.Error
      }
    }
  }, (goods: Array<Promotion>, error: boolean) => {
    if (error || goods.length < limit) {
      return
    }
    getAppPromotions(offset + limit, limit)
  })
}

const recommend = useChurchRecommendStore()
export const getAppRecommends = (offset: number, limit: number) => {
  recommend.getAppRecommends({
    Offset: offset,
    Limit: limit,
    TargetAppID: AppID.value,
    Message: {
      Error: {
        Title: 'MSG_GET_GOOD_RECOMMENDS',
        Message: 'MSG_GET_GOOD_RECOMMENDS_FAIL',
        Popup: true,
        Type: NotifyType.Error
      }
    }
  }, (goods: Array<Recommend>, error: boolean) => {
    if (error || goods.length < limit) {
      return
    }
    getAppRecommends(offset + limit, limit)
  })
}

const device = useChurchDeviceInfoStore()
export const getDeviceInfos = (offset: number, limit: number) => {
  device.getDeviceInfos({
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: 'MSG_GET_DEVICES',
        Message: 'MSG_GET_DEVICES_FAIL',
        Popup: true,
        Type: NotifyType.Error
      }
    }
  }, (devices: Array<DeviceInfo>, error: boolean) => {
    if (error || devices.length < limit) {
      return
    }
    getDeviceInfos(offset + limit, limit)
  })
}
