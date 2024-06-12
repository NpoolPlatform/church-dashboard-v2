<template>
  <div v-for='(group, index) in target' :key='index'>
    <q-select
      :disable='!updating ? false : true'
      v-model='group.CoinConfigID'
      :options='displayCoinConfigs'
      options-selected-class='text-deep-orange'
      emit-value
      label='MSG_COINS'
      map-options
      @update:model-value='onUpdate'
      use-input
      @filter='onFilter'
    />
    <q-input v-model='group.CoinValue' :label='$t("MSG_COIN_VALUE")' />
    <q-input v-model='group.CoinPreUSD' :label='$t("MSG_COIN_PRE_USD")' />
    <q-btn icon='remove' @click='removeInputGroup(index)' color='negative' />
  </div>
  <q-btn @click='addInputGroup'>
    +
  </q-btn>
</template>
<script setup lang='ts'>
import { inspirecoinconfig, eventinspire } from 'src/npoolstore'
import { computed, defineEmits, defineProps, toRef, ref, onMounted } from 'vue'
import { getCoinConfigs } from 'src/api/inspire'

interface Props {
  coins: Array<eventinspire.EventCoinReq>
  updating?: boolean
}

const props = defineProps<Props>()
const coins = toRef(props, 'coins')
const updating = toRef(props, 'updating')
const target = ref(coins.value)

const _coinConfig = inspirecoinconfig.useCoinConfigStore()
const myCoinConfigs = computed(() => _coinConfig.coinConfigs())
const coinConfigs = computed(() => myCoinConfigs.value.map((el) => {
  return {
    value: el.EntID,
    label: `${el.ID} | ${el.EntID} | ${el.CoinName} | ${el.CoinTypeID} | ${el.CoinUnit}`
  }
}))
const displayCoinConfigs = ref(coinConfigs.value.filter((el) => el.value))

const onFilter = (val: string, doneFn: (callbackFn: () => void) => void) => {
  doneFn(() => {
    displayCoinConfigs.value = coinConfigs.value.filter((el) => {
      return el?.label?.toLowerCase().includes(val.toLowerCase())
    })
  })
}

const emit = defineEmits<{(e: 'update:coins', coins: Array<eventinspire.EventCoinReq>): void}>()
const onUpdate = () => {
  console.log('coins: ', coins)
  emit('update:coins', target.value)
}

onMounted(() => {
  if (coinConfigs.value.length === 0) {
    getCoinConfigs(0, 100)
  }
})

const addInputGroup = () => {
  target.value.push({
    CoinConfigID: '',
    CoinValue: '',
    CoinPreUSD: ''
  })
}

const removeInputGroup = (index: number) => {
  target.value.splice(index, 1)
}
</script>
