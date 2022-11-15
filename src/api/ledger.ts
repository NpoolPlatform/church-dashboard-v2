import { NotifyType, useChurchLedgerWithdrawDepositStore, Withdraw } from 'npool-cli-v4'
import { appID } from './app'

const withdraw = useChurchLedgerWithdrawDepositStore()
export const getAppWithdraws = (offset: number, limit: number) => {
  withdraw.getAppWithdraws({
    TargetAppID: appID.value,
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
