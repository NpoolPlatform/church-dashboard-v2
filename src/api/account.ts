import { Account, NotifyType, useChurchUserAccountStore, useChurchPlatformAccountStore, PlatformAccount, useChurchPaymentAccountStore, useChurchGoodBenefitAccountStore } from 'npool-cli-v4'
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
  }, (accounts: Array<Account>, error: boolean) => {
    if (error || accounts.length < limit) {
      return
    }
    getNAppUserAccounts(offset + limit, limit)
  })
}

export const getAppDepositAccounts = (offset: number, limit: number) => {
  account.getAppDepositAccounts({
    TargetAppID: appID.value,
    Offset: offset,
    Limit: limit,
    Message: {}
  }, (accounts: Array<Account>, error: boolean) => {
    if (error || accounts.length < limit) {
      return
    }
    getAppDepositAccounts(offset + limit, limit)
  })
}

const platform = useChurchPlatformAccountStore()
export const getPlatformAccounts = (offset: number, limit: number) => {
  platform.getPlatformAccounts({
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: 'MSG_GET_ACCOUNTS',
        Message: 'MSG_GET_ACCOUNTS_FAIL',
        Popup: true,
        Type: NotifyType.Error
      }
    }
  }, (accounts: Array<PlatformAccount>, error: boolean) => {
    if (error || accounts.length < limit) {
      return
    }
    getNAppUserAccounts(offset + limit, limit)
  })
}

const payment = useChurchPaymentAccountStore()
export const getPaymentAccounts = (offset: number, limit: number) => {
  payment.getPaymentAccounts({
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: 'MSG_GET_PAYMENT_ACCOUNTS',
        Message: 'MSG_GET_PAYMENT_ACCOUNTS_FAIL',
        Popup: true,
        Type: NotifyType.Error
      }
    }
  }, (accounts: Array<PlatformAccount>, error: boolean) => {
    if (error || accounts.length < limit) {
      return
    }
    getPaymentAccounts(offset + limit, limit)
  })
}

const gb = useChurchGoodBenefitAccountStore()
export const getGoodBenefitAccounts = (offset: number, limit: number) => {
  gb.getGoodBenefitAccounts({
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: 'MSG_GET_GOODBENEFIT_ACCOUNTS',
        Message: 'MSG_GET_GOODBENEFIT_ACCOUNTS_FAIL',
        Popup: true,
        Type: NotifyType.Error
      }
    }
  }, (accounts: Array<PlatformAccount>, error: boolean) => {
    if (error || accounts.length < limit) {
      return
    }
    getGoodBenefitAccounts(offset + limit, limit)
  })
}
