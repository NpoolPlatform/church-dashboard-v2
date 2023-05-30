<template>
  <q-table
    dense
    flat
    :rows='displayHistories'
    row-key='ID'
    :title='$t("MSG_COIN_CURRENCY_HISTORIES")'
    :rows-per-page-options='[10]'
  >
    <template #top-right>
      <div class='row indent flat'>
        <q-input
          dense
          flat
          class='small'
          v-model='name'
          :label='$t("MSG_NAME")'
        />
      </div>
    </template>
  </q-table>
</template>

<script setup lang='ts'>
import { computed, onMounted, ref } from 'vue'
import { Currency } from 'src/teststore/coin/fiat/currency/history/types'
import { useCoinFiatCurrencyHistoryStore } from 'src/teststore/coin/fiat/currency/history'

const cfch = useCoinFiatCurrencyHistoryStore()
const cfchs = computed(() => cfch.Histories.Histories)

const name = ref('')
const displayHistories = computed(() => {
  return cfchs.value.filter((el) => el.CoinName.toLowerCase()?.includes?.(name.value?.toLowerCase()))
})

onMounted(() => {
  if (cfch.Histories.Histories.length === 0) {
    getCoinFiatCurrencyHistories(0, 100, 0, new Date().getTime())
  }
})

const getCoinFiatCurrencyHistories = (offset: number, limit: number, startAt: number, endAt: number) => {
  cfch.getCoinFiatCurrencyHistories({
    CoinTypeIDs: [''], // TODO
    Offset: offset,
    Limit: limit,
    StartAt: startAt,
    EndAt: endAt,
    Message: {}
  }, (error: boolean, rows: Currency[]) => {
    if (error || rows.length === 0) {
      return
    }
    getCoinFiatCurrencyHistories(offset + limit, limit, startAt, endAt)
  })
}
</script>
