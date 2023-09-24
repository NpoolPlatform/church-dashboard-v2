import { AppID } from './app'
import { ledgerwithdraw, notify } from 'src/npoolstore'

const withdraw = ledgerwithdraw.useWithdrawStore()
export const getAppWithdraws = (offset: number, limit: number) => {
  withdraw.getNAppWithdraws({
    TargetAppID: AppID.value,
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: 'MSG_GET_APP_WITHDRAWS',
        Message: 'MSG_GET_APP_WITHDRAWS_FAIL',
        Popup: true,
        Type: notify.NotifyType.Error
      }
    }
  }, (error: boolean, withdraws?: Array<ledgerwithdraw.Withdraw>) => {
    if (error || !withdraws?.length) {
      return
    }
    getAppWithdraws(offset + limit, limit)
  })
}
