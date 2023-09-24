<script setup lang='ts'>
import { onMounted, computed, watch } from 'vue'
import { applang, message, _locale, notify, g11nbase } from 'src/npoolstore'
import { AppID } from 'src/api/app'

const lang = applang.useAppLangStore()
const langs = computed(() => lang.langs(AppID.value))

const _message = message.useMessageStore()
const messages = computed(() => _message.messages(AppID.value, locale.langID()))

const locale = _locale.useLocaleStore()
const langID = computed(() => locale.AppLang?.LangID)

onMounted(() => {
  if (!langs.value.length) {
    getAppLangs(0, 100)
  }
})

watch(langID, () => {
  if (messages.value.length === 0) {
    getMessages(0, 100)
  }
})

const getAppLangs = (offset: number, limit: number) => {
  lang.getAppLangs({
    Offset: offset,
    Limit: limit,
    Message: {
    }
  }, (error: boolean, rows: Array<g11nbase.AppLang>) => {
    if (error || rows.length === 0) {
      if (!error) {
        locale.setLangs(langs.value)
        if (!messages.value.length) {
          getMessages(0, 100)
        }
      }
      return
    }
    getAppLangs(offset + limit, limit)
  })
}

const getMessages = (offset: number, limit: number) => {
  _message.getMessages({
    Disabled: false,
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: 'MSG_GET_LANG_MESSAGES',
        Message: 'MSG_GET_LANG_MESSAGES_FAIL',
        Popup: true,
        Type: notify.NotifyType.Error
      }
    }
  }, (error: boolean, rows?: Array<g11nbase.Message>) => {
    if (error || !rows?.length) {
      return
    }
    getMessages(offset + limit, limit)
  })
}
</script>
