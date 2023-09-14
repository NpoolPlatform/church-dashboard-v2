import { useApplicationStore } from 'src/npoolstore/appuser/app'
import { AppID as myAppID } from 'src/const/const'
import { computed } from 'vue'

const app = useApplicationStore()
if (!app.AppID) {
  app.AppID = myAppID
}
export const AppID = computed(() => app.AppID)
