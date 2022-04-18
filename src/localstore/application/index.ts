import { defineStore } from 'pinia'
import { AppID } from 'src/const/const'
import { LocalApplicationState } from './types'

export const useLocalApplicationStore = defineStore('localapplication', {
  state: (): LocalApplicationState => ({
    AppID: AppID
  }),
  getters: {},
  actions: {}
})
