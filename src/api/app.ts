import { useLocalApplicationStore } from 'src/localstore/application'
import { computed } from 'vue'

const app = useLocalApplicationStore()
export const appID = computed(() => app.AppID)
