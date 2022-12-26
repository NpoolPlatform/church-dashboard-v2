<script setup lang='ts'>
import { onMounted, computed } from 'vue'
// import { useI18n } from 'vue-i18n'
import { useChurchAppLangStore } from 'src/teststore/g11n/applang'
import { AppLang } from 'src/teststore/g11n/applang/types'
import { appID } from 'src/api/app'
import { useChurchMessageStore } from 'src/teststore/g11n/message'
import { getAppMessages } from 'src/api/g11n'
import { useLocalLangStore } from 'src/teststore/lang'

// eslint-disable-next-line @typescript-eslint/unbound-method
// const { t } = useI18n({ useScope: 'global' })

const lang = useChurchAppLangStore()
const langs = computed(() => lang.getAppLangsByAppID(appID.value))
const message = useChurchMessageStore()
const messages = computed(() => message.getMessagesByAppID(appID.value))

const local = useLocalLangStore()
onMounted(() => {
  if (langs.value.length === 0) {
    getAppLangs(0, 100)
  }
  if (messages.value.length === 0) {
    getAppMessages(0, 100)
  }
})

const getAppLangs = (offset: number, limit: number) => {
  lang.getAppLangs({
    TargetAppID: appID.value,
    Offset: offset,
    Limit: limit,
    Message: {
    }
  }, (error: boolean, rows: Array<AppLang>) => {
    if (error || rows.length === 0) {
      if (!error) {
        local.setLangs(langs.value)
      }
      return
    }
    getAppLangs(offset + limit, limit)
  })
}
</script>
