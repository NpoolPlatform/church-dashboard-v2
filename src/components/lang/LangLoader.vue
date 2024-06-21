<script setup lang='ts'>
import { onMounted, computed, watch } from 'vue'
import { _locale, user, sdk } from 'src/npoolstore'
import { useSettingStore } from 'src/localstore'
import { useRouter } from 'vue-router'

const locale = _locale.useLocaleStore()
const langID = computed(() => locale.langID())

const messages = computed(() => sdk.messages(langID.value))

watch(langID, () => {
  if (messages.value.length === 0) {
    sdk.getMessages(0, 0, () => {
      _setting.LangThrottling = false
    })
    return
  }
  _setting.LangThrottling = false
})

const router = useRouter()
const _setting = useSettingStore()
const logined = user.useLocalUserStore()
const langName = computed(() => router.currentRoute.value.path.split('/')?.[1])
const langs = sdk.appLanguages
const targetLangID = computed(() => sdk.langIdWithName(langName.value) || logined.selectedLangID || sdk.mainLangId.value || langs.value[0]?.LangID)

const setLang = () => {
  const _lang = sdk.appLangWithLangId(targetLangID.value)
  if (!_lang) return
  setTimeout(() => {
    if (_setting.LangThrottling) {
      setLang()
      return
    }
    locale.setLang(_lang)
  }, 1000)
}

watch(targetLangID, () => {
  setLang()
})

onMounted(() => {
  if (!langs.value.length) {
    sdk.getAppLangs(0, 0, (error: boolean) => {
      if (error) return
      setLang()
    })
  }
})
</script>
