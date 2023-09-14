import { NotifyType, Order, useChurchOrderStore } from 'npool-cli-v4'
import { AppID } from './app'

const order = useChurchOrderStore()

export const getNAppOrders = (offset: number, limit: number) => {
  order.getNAppOrders({
    TargetAppID: AppID.value,
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: 'MSG_GET_ORDERS',
        Message: 'MSG_GET_ORDERS_FAIL',
        Popup: true,
        Type: NotifyType.Error
      }
    }
  }, (orders: Array<Order>, error: boolean) => {
    if (error || orders.length < limit) {
      return
    }
    getNAppOrders(offset + limit, limit)
  })
}
