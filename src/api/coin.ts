import { Coin, CoinDescription, NotifyType, useChurchAppCoinDescriptionStore, useChurchCoinStore } from 'npool-cli-v4'
import { appID } from './app'

const coin = useChurchCoinStore()
export const getCoins = (offset : number, limit: number) => {
  coin.getCoins({
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: 'MSG_GET_COINS',
        Message: 'MSG_GET_COINS_FAIL',
        Popup: true,
        Type: NotifyType.Error
      }
    }
  }, (error: boolean, coins: Array<Coin>) => {
    if (error || coins.length < limit) {
      return
    }
    getCoins(offset + limit, limit)
  })
}

const description = useChurchAppCoinDescriptionStore()
export const getAppCoinDescriptions = (offset : number, limit: number) => {
  description.getAppCoinDescriptions({
    TargetAppID: appID.value,
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: 'MSG_GET_COIN_DESCRIPTIONS',
        Message: 'MSG_GET_COIN_DESCRIPTIONS_FAIL',
        Popup: true,
        Type: NotifyType.Error
      }
    }
  }, (error: boolean, descriptions: Array<CoinDescription>) => {
    if (error || descriptions.length < limit) {
      return
    }
    getAppCoinDescriptions(offset + limit, limit)
  })
}
