import { NotifyType } from 'npool-cli-v4'
import { fiatcurrency } from 'src/npoolstore'

const fiat = fiatcurrency.useFiatCurrencyStore()
export const getFiatCurrencyTypes = (offset: number, limit: number) => {
  fiat.getFiatCurrencyTypes({
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: 'MSG_GET_FIAT_CURRENCY_TYPES',
        Message: 'MSG_GET_FIAT_CURRENCY_TYPES_FAIL',
        Popup: true,
        Type: NotifyType.Error
      }
    }
  }, (error: boolean, rows: Array<fiatcurrency.FiatCurrencyType>) => {
    if (error || rows.length === 0) {
      return
    }
    getFiatCurrencyTypes(offset + limit, limit)
  })
}
