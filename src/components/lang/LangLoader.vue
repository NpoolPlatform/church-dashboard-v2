<script setup lang='ts'>
import { onMounted, computed, watch } from 'vue'
import { useLocaleStore } from 'npool-cli-v2'
import { useI18n } from 'vue-i18n'
import { useChurchAppLangStore } from 'src/teststore/g11n/applang'
import { NotifyType } from 'npool-cli-v4'
import { AppLang } from 'src/teststore/g11n/applang/types'
import { appID } from 'src/api/app'
import { useChurchMessageStore } from 'src/teststore/g11n/message'
import { getAppMessages } from 'src/api/g11n'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const lang = useChurchAppLangStore()
const langs = computed(() => lang.getAppLangsByAppID(appID.value))
const message = useChurchMessageStore()
const messages = computed(() => message.getMessagesByAppID(appID.value))

const locale = useLocaleStore()
const langID = computed(() => locale.CurLang?.ID)
watch(langID, () => {
  // lang.getLangMessages({
  //   LangID: langID.value as string,
  //   Message: {
  //     Error: {
  //       Title: t('MSG_GET_LANG_MESSAGES'),
  //       Message: t('MSG_GET_LANG_MESSAGES_FAIL'),
  //       Popup: true,
  //       Type: NotificationType.Error
  //     }
  //   }
  // })
})

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
      Error: {
        Title: t('MSG_GET_LANGS'),
        Message: t('MSG_GET_LANGS_FAIL'),
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
</script>
