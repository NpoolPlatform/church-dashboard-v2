import { Account, NotifyType, useChurchUserAccountStore } from 'npool-cli-v4'
import { appID } from './app'

const account = useChurchUserAccountStore()

export const getNAppUserAccounts = (offset: number, limit: number) => {
  account.getNAppUserAccounts({
    TargetAppID: appID.value,
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: 'MSG_GET_WITHDRAW_ADDRESS_REVIEWS',
        Message: 'MSG_GET_WITHDRAW_ADDRESS_REVIEWS_FAIL',
        Popup: true,
        Type: NotifyType.Error
      }
    }
  }, (resp: Array<Account>, error: boolean) => {
    if (error || resp.length < limit) {
      return
    }
    getNAppUserAccounts(offset + limit, limit)
  })
}
