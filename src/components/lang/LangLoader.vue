<script setup lang='ts'>
import { onMounted, computed } from 'vue'
// import { useI18n } from 'vue-i18n'
import { AppLang, useAdminAppLangStore, useAdminMessageStore, Message, useLocaleStore } from 'npool-cli-v4'

// eslint-disable-next-line @typescript-eslint/unbound-method
// const { t } = useI18n({ useScope: 'global' })

const lang = useAdminAppLangStore()
const langs = computed(() => lang.AppLangs.AppLangs)
const message = useAdminMessageStore()
const messages = computed(() => message.Messages.Messages)

onMounted(() => {
  if (langs.value.length === 0) {
    getAppLangs(0, 100)
  }
  if (messages.value.length === 0) {
    getAppMessages(0, 100)
  }
})

const locale = useLocaleStore()
const getAppLangs = (offset: number, limit: number) => {
  lang.getAppLangs({
    Offset: offset,
    Limit: limit,
    Message: {
    }
  }, (error: boolean, rows: Array<AppLang>) => {
    if (error || rows.length === 0) {
      if (!error) {
        locale.setLangs(langs.value)
      }
      return
    }
    getAppLangs(offset + limit, limit)
  })
}

const getAppMessages = (offset: number, limit: number) => {
  message.getMessages({
    Offset: offset,
    Limit: limit,
    Disabled: false,
    NotifyMessage: {}
  }, (error: boolean, rows: Array<Message>) => {
    if (error || rows.length === 0) {
      return
    }
    getAppLangs(offset + limit, limit)
  })
}
</script>
