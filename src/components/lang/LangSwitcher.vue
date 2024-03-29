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
import { ref, computed, defineProps, withDefaults, toRef, defineEmits, onMounted } from 'vue'
import { applang, _locale, g11nbase } from 'src/npoolstore'
import { AppID } from 'src/api/app'

interface Props {
  language?: g11nbase.AppLang
  emitResult?: boolean
  setLang?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  language: undefined,
  emitResult: false,
  setLang: true
})

const emitResult = toRef(props, 'emitResult')
const setLang = toRef(props, 'setLang')
const language = toRef(props, 'language')

const downArrow = ref('img: icons/DownArrow.svg')
const internet = ref('img: icons/Internet.svg')

const locale = _locale.useLocaleStore()

const lang = applang.useAppLangStore()
const langs = computed(() => lang.langs(AppID.value))

const langLabel = computed(() => {
  if (language.value) {
    return language.value.Short
  }
  return locale.AppLang?.Short !== '' ? locale.AppLang?.Short : locale.AppLang.Lang
})

const emit = defineEmits<{(e: 'update:language', language: g11nbase.AppLang): void}>()

const onLangItemClick = (language: g11nbase.AppLang) => {
  if (emitResult.value) {
    emit('update:language', language)
  }
  if (setLang.value) {
    locale.setLang(language)
  }
}

onMounted(() => {
  if (emitResult.value) {
    emit('update:language', locale.AppLang as g11nbase.AppLang)
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
