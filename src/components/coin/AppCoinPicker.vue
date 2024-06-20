<template>
  <q-select
    :disable='!updating ? false : true'
    v-model='target'
    :options='displayCoins'
    options-selected-class='text-deep-orange'
    emit-value
    label='MSG_APP_COINS'
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
import { getAppCoins } from 'src/api/coin'
import { computed, defineEmits, defineProps, toRef, ref, onMounted, watch } from 'vue'
import { appcoin, sdk } from 'src/npoolstore'

const AppID = sdk.AppID

interface Props {
  id: string
  updating?: boolean
}

const props = defineProps<Props>()
const id = toRef(props, 'id')
const updating = toRef(props, 'updating')
const target = ref(id.value)

const coin = appcoin.useAppCoinStore()
const coins = computed(() => Array.from(coin.coins(AppID.value).filter((el) => !el.Disabled)).map((el) => {
  return {
    value: el.CoinTypeID,
    label: `${el.Name} | ${el.CoinTypeID}`
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
  if (!coin.coins(AppID.value).length) {
    getAppCoins(0, 100)
  }
})

watch(AppID, () => {
  if (!coin.coins(AppID.value).length) {
    getAppCoins(0, 100)
  }
})
</script>
