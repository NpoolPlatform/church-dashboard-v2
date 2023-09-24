import { AppID } from './app'
import { coin, notify, appcoindescription, appcoin } from 'src/npoolstore'

const _coin = coin.useCoinStore()
export const getCoins = (offset : number, limit: number) => {
  _coin.getCoins({
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: 'MSG_GET_COINS',
        Message: 'MSG_GET_COINS_FAIL',
        Popup: true,
        Type: notify.NotifyType.Error
      }
    }
  }, (error: boolean, coins?: Array<coin.Coin>) => {
    if (error || !coins?.length) {
      return
    }
    getCoins(offset + limit, limit)
  })
}

const description = appcoindescription.useCoinDescriptionStore()
export const getAppCoinDescriptions = (offset : number, limit: number) => {
  description.getAppCoinDescriptions({
    TargetAppID: AppID.value,
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: 'MSG_GET_COIN_DESCRIPTIONS',
        Message: 'MSG_GET_COIN_DESCRIPTIONS_FAIL',
        Popup: true,
        Type: notify.NotifyType.Error
      }
    }
  }, (error: boolean, descriptions?: Array<appcoindescription.CoinDescription>) => {
    if (error || !descriptions?.length) {
      return
    }
    getAppCoinDescriptions(offset + limit, limit)
  })
}

const appCoin = appcoin.useAppCoinStore()
export const getAppCoins = (offset : number, limit: number) => {
  appCoin.getNAppCoins({
    TargetAppID: AppID.value,
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: 'MSG_GET_COINS',
        Message: 'MSG_GET_COINS_FAIL',
        Popup: true,
        Type: notify.NotifyType.Error
      }
    }
  }, (error: boolean, coins?: Array<appcoin.AppCoin>) => {
    if (error || !coins?.length) {
      return
    }
    getAppCoins(offset + limit, limit)
  })
}
