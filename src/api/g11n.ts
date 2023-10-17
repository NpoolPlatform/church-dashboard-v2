import { AppID } from './app'
import { country, notify, appcountry, language, applang, message, g11nbase } from 'src/npoolstore'

const _country = country.useCountryStore()
export const getCountries = (offset: number, limit: number) => {
  _country.getCountries({
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: 'MSG_GET_COUNTRIES',
        Message: 'MSG_GET_COUNTRIES_FAIL',
        Popup: true,
        Type: notify.NotifyType.Error
      }
    }
  }, (error: boolean, rows: Array<country.Country>) => {
    if (error || rows.length === 0) {
      return
    }
    getCountries(offset + limit, limit)
  })
}

const appCountry = appcountry.useAppCountryStore()
export const getAppCountries = (offset: number, limit: number) => {
  appCountry.getNAppCountries({
    TargetAppID: AppID.value,
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: 'MSG_GET_APP_COUNTRIES',
        Message: 'MSG_GET_APP_COUNTRIES_FAIL',
        Popup: true,
        Type: notify.NotifyType.Error
      }
    }
  }, (error: boolean, rows: Array<appcountry.Country>) => {
    if (error || rows.length === 0) {
      return
    }
    getAppCountries(offset + limit, limit)
  })
}

const lang = language.useLangStore()
export const getLangs = (offset: number, limit: number) => {
  lang.getLangs({
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: 'MSG_GET_LANGUAGES',
        Message: 'MSG_GET_LANGUAGES_FAIL',
        Popup: true,
        Type: notify.NotifyType.Error
      }
    }
  }, (error: boolean, rows: Array<language.Lang>) => {
    if (error || rows.length === 0) {
      return
    }
    getLangs(offset + limit, limit)
  })
}

const appLang = applang.useAppLangStore()
export const getAppLangs = (offset: number, limit: number) => {
  appLang.getNAppLangs({
    TargetAppID: AppID.value,
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: 'MSG_GET_APP_LANGUAGES',
        Message: 'MSG_GET_APP_LANGUAGES_FAIL',
        Popup: true,
        Type: notify.NotifyType.Error
      }
    }
  }, (error: boolean, rows: Array<g11nbase.AppLang>) => {
    if (error || rows.length === 0) {
      return
    }
    getAppLangs(offset + limit, limit)
  })
}
const _message = message.useMessageStore()
export const getAppMessages = (offset: number, limit: number) => {
  _message.getAppMessages({
    TargetAppID: AppID.value,
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: 'MSG_GET_APP_MESSAGES',
        Message: 'MSG_GET_APP_MESSAGES_FAIL',
        Popup: true,
        Type: notify.NotifyType.Error
      }
    }
  }, (error: boolean, rows: Array<g11nbase.Message>) => {
    if (error || rows.length < limit) {
      return
    }
    getAppMessages(offset + limit, limit)
  })
}
