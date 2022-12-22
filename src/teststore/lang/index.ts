import { defineStore } from 'pinia'
import { Cookies } from 'quasar'
import { AppLang } from '../g11n/applang/types'

export const useLocalLangStore = defineStore('local-lang-v4', {
  state: () => ({
    AppLang: undefined as unknown as AppLang
  }),
  getters: {
    setLang () {
      return (lang: AppLang) => {
        this.AppLang = lang
        Cookies.set('X-Lang-ID', lang.ID, { expires: '4h', secure: true })
      }
    }
  },
  actions: {

  }
})
