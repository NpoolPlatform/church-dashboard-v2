import { fiat, notify } from 'src/npoolstore'

const _fiat = fiat.useFiatStore()
export const getFiatCurrencyTypes = (offset: number, limit: number) => {
  _fiat.getFiats({
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: 'MSG_GET_FIAT_CURRENCY_TYPES',
        Message: 'MSG_GET_FIAT_CURRENCY_TYPES_FAIL',
        Popup: true,
        Type: notify.NotifyType.Error
      }
    }
  }, (error: boolean, rows?: Array<fiat.Fiat>) => {
    if (error || !rows?.length) {
      return
    }
    getFiatCurrencyTypes(offset + limit, limit)
  })
}
