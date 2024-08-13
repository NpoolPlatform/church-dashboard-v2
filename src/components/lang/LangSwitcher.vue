<template>
  <div class='row'>
    <q-btn-dropdown
      dense
      flat
      :icon='internet'
      :dropdown-icon='downArrow'
      text-color='white'
      size='12px'
    >
      <template #label>
        <div class='label'>
          {{ langLabel }}
        </div>
      </template>
      <q-list class='langs'>
        <q-item
          class='item'
          dense
          v-close-popup
          v-for='myLang in langs'
          :key='myLang.ID'
          clickable
          @click='onLangItemClick(myLang)'
        >
          <q-item-section>
            <div class='row'>
              <q-img fit='contain' class='icon' :src='myLang.Logo' />
              <q-item-label dense>
                {{ myLang.Name }}
              </q-item-label>
            </div>
          </q-item-section>
        </q-item>
      </q-list>
    </q-btn-dropdown>
  </div>
</template>

<script setup lang='ts'>
import { ref, computed, watch, onMounted } from 'vue'
import { _locale, g11nbase, sdk } from 'src/npoolstore'

const downArrow = ref('img: icons/DownArrow.svg')
const internet = ref('img: icons/Internet.svg')

const locale = _locale.useLocaleStore()

const langLabel = computed(() => {
  if (locale.lang()) {
    return locale.locale()
  }
  return locale.AppLang?.Short !== '' ? locale.AppLang?.Short : locale.AppLang.Lang
})

const langs = computed(() => sdk.appLanguages.value)

const onLangItemClick = (language: g11nbase.AppLang) => {
  console.log('LangID: ', language.LangID)
  locale.setLang(language)
}

const AppID = sdk.AppID
watch(AppID, () => {
  if (!langs.value?.length) {
    sdk.adminGetAppLangs(0, 0)
  }
})

onMounted(() => {
  if (!langs.value?.length) {
    sdk.adminGetAppLangs(0, 0)
  }
})
</script>

<style lang='sass' scoped>
.label
  font-size: 18px
  margin-left: 6px
  line-height: 24px

.langs
  background-color: $primary

.item:hover
  background-color: $secondary

.icon
  width: 24px
  margin-right: 10px
</style>
