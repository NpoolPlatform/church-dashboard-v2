import { localapp } from 'src/npoolstore'
import { AppID as myAppID } from 'src/const/const'
import { computed } from 'vue'

const myApp = localapp.useMyApplicationStore()
if (!myApp.AppID) {
  myApp.AppID = myAppID
}
export const AppID = computed(() => myApp.AppID)
