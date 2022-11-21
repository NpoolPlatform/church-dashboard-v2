import { NotificationType, useCoinStore } from 'npool-cli-v2'
import { Coin, NotifyType, useChurchCoinStore } from 'npool-cli-v4'

const coin = useCoinStore()
export const getCoins = () => {
  coin.getCoins({
    Message: {
      Error: {
        Title: 'MSG_GET_COINS',
        Message: 'MSG_GET_COINS_FAIL',
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, () => {
    // TODO
  })
}

const coinInfo = useChurchCoinStore()
export const getCoinsInfos = (offset : number, limit: number) => {
  coinInfo.getCoins({
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
  }, (error, coins: Array<Coin>) => {
    if (error || coins.length < limit) {
      return
    }
    getCoinsInfos(offset + limit, limit)
  })
}
