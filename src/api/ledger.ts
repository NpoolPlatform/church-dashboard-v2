import { NotifyType, useChurchLedgerWithdrawStore, Withdraw } from 'npool-cli-v4'
import { AppID } from './app'

const withdraw = useChurchLedgerWithdrawStore()
export const getAppWithdraws = (offset: number, limit: number) => {
  withdraw.getAppWithdraws({
    TargetAppID: AppID.value,
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: 'MSG_GET_APP_WITHDRAWS',
        Message: 'MSG_GET_APP_WITHDRAWS_FAIL',
        Popup: true,
        Type: NotifyType.Error
      }
    }
  }, (withdraws: Array<Withdraw>, error: boolean) => {
    if (error || withdraws.length < limit) {
      return
    }
    getAppWithdraws(offset + limit, limit)
  })
}
