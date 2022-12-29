<template>
  <q-select
    :disable='!updating ? false : true'
    v-model='target'
    :options='displayLangs'
    options-selected-class='text-deep-orange'
    emit-value
    :label='myLabel'
    map-options
    @update:model-value='onUpdate'
    use-input
    @filter='onFilter'
  >
    <template #option='scope'>
      <q-item v-bind='scope.itemProps'>
        <q-item-section>
          <q-item-label>{{ scope.opt.label }}</q-item-label>
        </q-item-section>
      </q-item>
    </template>
  </q-select>
</template>
<script setup lang='ts'>
import { getLangs } from 'src/api/g11n'
import { useChurchLangStore } from 'npool-cli-v4'
import { computed, defineEmits, defineProps, toRef, ref, onMounted } from 'vue'

interface Props {
  id: string
  updating?: boolean
  label?: string,
}

const props = defineProps<Props>()
const id = toRef(props, 'id')
const updating = toRef(props, 'updating')
const label = toRef(props, 'label')

const myLabel = computed(() => {
  return !label.value ? 'MSG_LANGUAGES' : label.value
})

const target = ref(id.value)

const lang = useChurchLangStore()
const langs = computed(() => Array.from(lang.Langs.Langs).map((el) => {
  return {
    value: el.ID,
    label: `${el.Lang} | ${el.Short}`
  }
}))
const displayLangs = ref(langs.value)

const onFilter = (val: string, doneFn: (callbackFn: () => void) => void) => {
  doneFn(() => {
    displayLangs.value = langs.value.filter((el) => {
      return el?.label?.toLowerCase().includes(val.toLowerCase())
    })
  })
}

const emit = defineEmits<{(e: 'update:id', id: string): void}>()
const onUpdate = () => {
  emit('update:id', target.value)
}

onMounted(() => {
  if (lang.Langs.Langs.length === 0) {
    getLangs(0, 100)
  }
})
</script>
