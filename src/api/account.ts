import { AppID } from './app'
import { useraccount, notify, accountbase, goodbenefitaccount, platformaccount, paymentaccount } from 'src/npoolstore'

const account = useraccount.useUserAccountStore()

export const getNAppUserAccounts = (offset: number, limit: number) => {
  account.getNAppUserAccounts({
    TargetAppID: AppID.value,
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: 'MSG_GET_WITHDRAW_ADDRESS_REVIEWS',
        Message: 'MSG_GET_WITHDRAW_ADDRESS_REVIEWS_FAIL',
        Popup: true,
        Type: notify.NotifyType.Error
      }
    }
  }, (error: boolean, accounts?: Array<accountbase.Account>) => {
    if (error || !accounts?.length) {
      return
    }
    getNAppUserAccounts(offset + limit, limit)
  })
}

export const getAppDepositAccounts = (offset: number, limit: number) => {
  account.getAppDepositAccounts({
    TargetAppID: AppID.value,
    Offset: offset,
    Limit: limit,
    Message: {}
  }, (error: boolean, accounts?: Array<accountbase.Account>) => {
    if (error || !accounts?.length) {
      return
    }
    getAppDepositAccounts(offset + limit, limit)
  })
}

const platform = platformaccount.usePlatformAccountStore()
export const getPlatformAccounts = (offset: number, limit: number) => {
  platform.getPlatformAccounts({
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: 'MSG_GET_ACCOUNTS',
        Message: 'MSG_GET_ACCOUNTS_FAIL',
        Popup: true,
        Type: notify.NotifyType.Error
      }
    }
  }, (error: boolean, accounts?: Array<platformaccount.Account>) => {
    if (error || !accounts?.length) {
      return
    }
    getNAppUserAccounts(offset + limit, limit)
  })
}

const payment = paymentaccount.usePaymentAccountStore()
export const getPaymentAccounts = (offset: number, limit: number) => {
  payment.getPaymentAccounts({
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: 'MSG_GET_PAYMENT_ACCOUNTS',
        Message: 'MSG_GET_PAYMENT_ACCOUNTS_FAIL',
        Popup: true,
        Type: notify.NotifyType.Error
      }
    }
  }, (error: boolean, accounts?: Array<paymentaccount.Account>) => {
    if (error || !accounts?.length) {
      return
    }
    getPaymentAccounts(offset + limit, limit)
  })
}

const goodbenefit = goodbenefitaccount.useGoodBenefitAccountStore()
export const getGoodBenefitAccounts = (offset: number, limit: number) => {
  goodbenefit.getGoodBenefitAccounts({
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: 'MSG_GET_GOODBENEFIT_ACCOUNTS',
        Message: 'MSG_GET_GOODBENEFIT_ACCOUNTS_FAIL',
        Popup: true,
        Type: notify.NotifyType.Error
      }
    }
  }, (error: boolean, accounts?: Array<goodbenefitaccount.Account>) => {
    if (error || !accounts?.length) {
      return
    }
    getGoodBenefitAccounts(offset + limit, limit)
  })
}
