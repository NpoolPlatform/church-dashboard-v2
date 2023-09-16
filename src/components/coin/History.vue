<template>
  <q-table
    dense
    flat
    :rows='displayCoins'
    row-key='ID'
    :title='$t("MSG_COINS")'
    selection='multiple'
    v-model:selected='selectedCoins'
    :rows-per-page-options='[100]'
  >
    <template #top-right>
      <div class='row indent flat'>
        <q-input
          dense
          flat
          class='small'
          v-model='name'
          :label='$t("MSG_COINNAME")'
        />
      </div>
    </template>
  </q-table>
  <CoinCurrencyHistory :ids='ids' />
  <CoinFiatCurrencyHistory :ids='ids' />
  <FiatCurrencyHistory />
</template>
<script setup lang='ts'>
import { getCoins } from 'src/api/coin'
import { defineAsyncComponent, computed, ref, onMounted } from 'vue'
import { coin } from 'src/npoolstore'

const CoinCurrencyHistory = defineAsyncComponent(() => import('src/components/coin/CoinCurrencyHistory.vue'))
const FiatCurrencyHistory = defineAsyncComponent(() => import('src/components/coin/FiatCurrencyHistory.vue'))
const CoinFiatCurrencyHistory = defineAsyncComponent(() => import('src/components/coin/CoinFiatCurrencyHistory.vue'))

const _coin = coin.useCoinStore()
const coins = computed(() => _coin.coins())

const name = ref('')
const displayCoins = computed(() => {
  return coins.value.filter((el) => el.Name?.toLowerCase()?.includes?.(name.value?.toLowerCase()) || el.ID?.toLowerCase()?.includes(name.value?.toLowerCase()))
})

const selectedCoins = ref([] as Array<coin.Coin>)

const ids = computed(() => {
  const _ids = [] as Array<string>
  selectedCoins.value?.forEach((el) => _ids.push(el.ID))
  return _ids
})

onMounted(() => {
  if (!coins.value.length) {
    getCoins(0, 100)
  }
})
</script>
