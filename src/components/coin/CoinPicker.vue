<template>
  <q-select
    :disable='!updating ? false : true'
    v-model='target'
    :options='displayCoins'
    options-selected-class='text-deep-orange'
    emit-value
    label='MSG_COINS'
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
import { useCoinStore } from 'npool-cli-v2'
import { getCoins } from 'src/api/coin'
import { computed, defineEmits, defineProps, toRef, ref, onMounted } from 'vue'

interface Props {
  coin: string
  updating?: boolean
}

const props = defineProps<Props>()
const coin = toRef(props, 'coin')
const updating = toRef(props, 'updating')
const target = ref(coin.value)

const coinStore = useCoinStore()
const coins = computed(() => Array.from(coinStore.Coins).map((el) => {
  return {
    value: el.ID,
    label: el.Name
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

const emit = defineEmits<{(e: 'update:coin', coin: string): void}>()
const onUpdate = () => {
  emit('update:coin', target.value)
}

onMounted(() => {
  if (coinStore.Coins.length === 0) {
    getCoins()
  }
})
</script>
