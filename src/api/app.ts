import { localapp } from 'src/npoolstore'
import { AppID as myAppID } from 'src/const/const'
import { computed } from 'vue'
import { NIL as NIL_UUID } from 'uuid'

const myApp = localapp.useLocalApplicationStore()
if (!myApp.myAppID) {
  myApp.MyAppID = myAppID
}
export const AppID = computed(() => myApp.currentAppID || myApp.myAppID || NIL_UUID)
export const CurrentAppID = computed(() => myApp.currentAppID)
export { myAppID }
