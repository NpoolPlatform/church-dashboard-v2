<template>
  <q-select
    :disable='!updating ? false : true'
    v-model='lang'
    :options='languages'
    options-selected-class='text-deep-orange'
    emit-value
    map-options
    @update:model-value='onUpdate'
  >
    <template #option='scope'>
      <q-item v-bind='scope.itemProps'>
        <q-item-section avatar>
          <q-img fit='contain' class='icon' :src='scope.opt.icon' />
        </q-item-section>
        <q-item-section>
          <q-item-label>{{ scope.opt.label }}</q-item-label>
        </q-item-section>
      </q-item>
    </template>
  </q-select>
</template>
<script setup lang='ts'>
import { computed, defineEmits, defineProps, toRef, ref, onMounted, watch } from 'vue'
import { sdk } from 'src/npoolstore'

const AppID = sdk.AppID

interface Props {
  language: string
  updating?: boolean
}

const props = defineProps<Props>()
const language = toRef(props, 'language')
const updating = toRef(props, 'updating')

const lang = ref(language.value)

const langs = sdk.appLanguages
const languages = computed(() => Array.from(langs.value).map((el) => {
  return {
    value: el.LangID,
    label: el.Name,
    icon: el.Logo
  }
}))

const emit = defineEmits<{(e: 'update:language', language: string): void}>()
const onUpdate = () => {
  emit('update:language', lang.value)
}

watch(AppID, () => {
  if (langs.value.length === 0) {
    sdk.getAppLangs(0, 0)
  }
})

onMounted(() => {
  if (!language.value) {
    emit('update:language', lang.value)
  }

  if (langs.value.length === 0) {
    sdk.getAppLangs(0, 0)
  }
})
</script>
