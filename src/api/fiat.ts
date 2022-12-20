import { NotifyType } from 'npool-cli-v4'
import { useChurchFiatCurrencyStore } from 'src/teststore/fiat-currency'
import { FiatCurrencyType } from 'src/teststore/fiat-currency/types'

const fiat = useChurchFiatCurrencyStore()
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
  }, (error: boolean, rows: Array<FiatCurrencyType>) => {
    if (error || rows.length === 0) {
      return
    }
    getFiatCurrencyTypes(offset + limit, limit)
  })
}
