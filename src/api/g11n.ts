import { NotifyType } from 'npool-cli-v4'
import { useChurchAppCountryStore } from 'src/teststore/g11n/appcountry'
import { AppCountry } from 'src/teststore/g11n/appcountry/types'
import { useChurchCountryStore } from 'src/teststore/g11n/country'
import { Country } from 'src/teststore/g11n/country/types'
import { appID } from './app'

const country = useChurchCountryStore()
export const getCountries = (offset: number, limit: number) => {
  country.getCountries({
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: 'MSG_GET_COUNTRIES',
        Message: 'MSG_GET_COUNTRIES_FAIL',
        Popup: true,
        Type: NotifyType.Error
      }
    }
  }, (error: boolean, rows: Array<Country>) => {
    if (error || rows.length === 0) {
      return
    }
    getCountries(offset + limit, limit)
  })
}

const appCountry = useChurchAppCountryStore()
export const getAppCountries = (offset: number, limit: number) => {
  appCountry.getAppCountries({
    TargetAppID: appID.value,
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: 'MSG_GET_APP_COUNTRIES',
        Message: 'MSG_GET_APP_COUNTRIES_FAIL',
        Popup: true,
        Type: NotifyType.Error
      }
    }
  }, (error: boolean, rows: Array<AppCountry>) => {
    if (error || rows.length === 0) {
      return
    }
    getAppCountries(offset + limit, limit)
  })
}
