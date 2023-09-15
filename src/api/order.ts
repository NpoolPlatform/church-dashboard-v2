import { AppID } from './app'
import { order, notify } from 'src/npoolstore'

const _order = order.useOrderStore()

export const getNAppOrders = (offset: number, limit: number) => {
  _order.getNAppOrders({
    TargetAppID: AppID.value,
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: 'MSG_GET_ORDERS',
        Message: 'MSG_GET_ORDERS_FAIL',
        Popup: true,
        Type: notify.NotifyType.Error
      }
    }
  }, (error: boolean, orders?: Array<order.Order>) => {
    if (error || !orders?.length) {
      return
    }
    getNAppOrders(offset + limit, limit)
  })
}
