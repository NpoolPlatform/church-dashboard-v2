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
import { getCoins } from 'src/api/coin'
import { computed, defineEmits, defineProps, toRef, ref, onMounted } from 'vue'
import { coin } from 'src/npoolstore'

interface Props {
  id: string
  updating?: boolean
  label?: string,
  getData?: boolean
}

const props = defineProps<Props>()
const id = toRef(props, 'id')
const updating = toRef(props, 'updating')
const label = toRef(props, 'label')
const getData = toRef(props, 'getData')

const myLabel = computed(() => {
  return !label.value ? 'MSG_COINS' : label.value
})

const target = ref(id.value)

const _coin = coin.useCoinStore()
const coins = computed(() => Array.from(_coin.coins()).map((el) => {
  return {
    value: el.ID,
    label: `${el.Name} | ${el.ID}`
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

const emit = defineEmits<{(e: 'update:id', id: string): void}>()
const onUpdate = () => {
  emit('update:id', target.value)
}

onMounted(() => {
  if (!coins.value.length && (getData.value === undefined || getData.value === false)) {
    getCoins(0, 100)
  }
})
</script>
