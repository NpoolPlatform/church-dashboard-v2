import { AppID } from './app'
import { appgood, good, notify, deviceinfo } from 'src/npoolstore'

const _good = good.useGoodStore()
export const getGoods = (offset: number, limit: number) => {
  _good.getGoods({
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: 'MSG_GET_GOODS',
        Message: 'MSG_GET_GOODS_FAIL',
        Popup: true,
        Type: notify.NotifyType.Error
      }
    }
  }, (error: boolean, goods?: Array<good.Good>) => {
    if (error || !goods?.length) {
      return
    }
    getGoods(offset + limit, limit)
  })
}

const appGood = appgood.useAppGoodStore()
export const getAppGoods = (offset: number, limit: number) => {
  appGood.getNAppGoods({
    Offset: offset,
    Limit: limit,
    TargetAppID: AppID.value,
    Message: {
      Error: {
        Title: 'MSG_GET_APP_GOODS',
        Message: 'MSG_GET_APP_GOODS_FAIL',
        Popup: true,
        Type: notify.NotifyType.Error
      }
    }
  }, (error: boolean, goods?: Array<appgood.Good>) => {
    if (error || !goods?.length) {
      return
    }
    getAppGoods(offset + limit, limit)
  })
}

const device = deviceinfo.useDeviceInfoStore()
export const getDeviceInfos = (offset: number, limit: number) => {
  device.getDeviceInfos({
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: 'MSG_GET_DEVICES',
        Message: 'MSG_GET_DEVICES_FAIL',
        Popup: true,
        Type: notify.NotifyType.Error
      }
    }
  }, (error: boolean, devices?: Array<deviceinfo.DeviceInfo>) => {
    if (error || !devices?.length) {
      return
    }
    getDeviceInfos(offset + limit, limit)
  })
}
