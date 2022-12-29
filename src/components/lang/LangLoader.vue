<script setup lang='ts'>
import { onMounted, computed } from 'vue'
import { AppLang, Message, NotifyType, useAdminAppLangStore, useAdminMessageStore, useLocaleStore } from 'npool-cli-v4'
import { useI18n } from 'vue-i18n'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })
const lang = useAdminAppLangStore()
const langs = computed(() => lang.AppLangs.AppLangs)

const message = useAdminMessageStore()
const messages = computed(() => message.Messages.Messages)

const locale = useLocaleStore()

onMounted(() => {
  if (langs.value.length === 0) {
    getAppLangs(0, 100)
  }
  if (messages.value.length === 0) {
    getMessages(0, 500)
  }
})

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

const getMessages = (offset: number, limit: number) => {
  message.getMessages({
    Disabled: false,
    Offset: offset,
    Limit: limit,
    NotifyMessage: {
      Error: {
        Title: t('MSG_GET_LANG_MESSAGES'),
        Message: t('MSG_GET_LANG_MESSAGES_FAIL'),
        Popup: true,
        Type: NotifyType.Error
      }
    }
  }, (error: boolean, rows: Array<Message>) => {
    if (error || rows.length === 0) {
      return
    }
    getMessages(offset + limit, limit)
  })
}
</script>
