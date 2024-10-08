<template>
  <q-select
    :disable='!updating ? false : true'
    v-model='target'
    :options='displayCoins'
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
import { computed, defineEmits, defineProps, toRef, ref, onMounted } from 'vue'
import { sdk } from 'src/npoolstore'

interface Props {
  name: string
  updating?: boolean
  label?: string,
  getData?: boolean
}

const props = defineProps<Props>()
const name = toRef(props, 'name')
const updating = toRef(props, 'updating')
const label = toRef(props, 'label')
const getData = toRef(props, 'getData')

const myLabel = computed(() => {
  return !label.value ? 'MSG_COINS' : label.value
})

const target = ref(name.value)

const coins = computed(() => Array.from(sdk.coins.value).map((el) => {
  return {
    value: el.Name,
    label: `${el.Name} | ${el.EntID} | ${el.ID}`
  }
}))
const displayCoins = ref(coins.value)

const onFilter = (val: string, doneFn: (callbackFn: () => void) => void) => {
  doneFn(() => {
    displayCoins.value = coins.value.filter((el) => {
      return el?.label?.toLowerCase().includes(val.toLowerCase())
    })
  })
}

const emit = defineEmits<{(e: 'update:name', name: string): void}>()
const onUpdate = () => {
  emit('update:name', target.value)
}

onMounted(() => {
  if (!coins.value.length && (getData.value === undefined || getData.value === false)) {
    sdk.getCoins(0, 0)
  }
})
</script>
