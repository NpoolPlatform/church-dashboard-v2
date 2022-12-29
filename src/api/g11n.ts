import {
  NotifyType,
  useChurchAppCountryStore,
  AppCountry,
  useChurchAppLangStore,
  AppLang,
  useChurchCountryStore,
  Country,
  useChurchLangStore,
  Lang,
  useChurchMessageStore,
  Message
} from 'npool-cli-v4'
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

const lang = useChurchLangStore()
export const getLangs = (offset: number, limit: number) => {
  lang.getLangs({
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: 'MSG_GET_LANGUAGES',
        Message: 'MSG_GET_LANGUAGES_FAIL',
        Popup: true,
        Type: NotifyType.Error
      }
    }
  }, (error: boolean, rows: Array<Lang>) => {
    if (error || rows.length === 0) {
      return
    }
    getLangs(offset + limit, limit)
  })
}

const appLang = useChurchAppLangStore()
export const getAppLangs = (offset: number, limit: number) => {
  appLang.getAppLangs({
    TargetAppID: appID.value,
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: 'MSG_GET_APP_LANGUAGES',
        Message: 'MSG_GET_APP_LANGUAGES_FAIL',
        Popup: true,
        Type: NotifyType.Error
      }
    }
  }, (error: boolean, rows: Array<AppLang>) => {
    if (error || rows.length === 0) {
      return
    }
    getAppLangs(offset + limit, limit)
  })
}
const message = useChurchMessageStore()
export const getAppMessages = (offset: number, limit: number) => {
  message.getAppMessages({
    TargetAppID: appID.value,
    Offset: offset,
    Limit: limit,
    NotifyMessage: {
      Error: {
        Title: 'MSG_GET_APP_MESSAGES',
        Message: 'MSG_GET_APP_MESSAGES_FAIL',
        Popup: true,
        Type: NotifyType.Error
      }
    }
  }, (error: boolean, rows: Array<Message>) => {
    if (error || rows.length < limit) {
      return
    }
    getAppMessages(offset + limit, limit)
  })
}
