<template>
  <q-table
    dense
    flat
    :rows='displayHistories'
    row-key='ID'
    :title='$t("MSG_COIN_FIAT_CURRENCY_HISTORIES")'
    :rows-per-page-options='[100]'
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
import { computed, defineProps, ref, watch, toRef } from 'vue'
import { coinfiatcurrencyhistory } from 'src/npoolstore'

interface Props {
  ids: string[]
}

const props = defineProps<Props>()
const ids = toRef(props, 'ids')

const history = coinfiatcurrencyhistory.useCoinFiatCurrencyHistoryStore()
const histories = computed(() => history.histories())

const name = ref('')
const displayHistories = computed(() => {
  return histories.value.filter((el) => el.CoinName.toLowerCase()?.includes?.(name.value?.toLowerCase()))
})

watch(ids, () => {
  if (ids.value?.length > 0) {
    history.$reset()
    getCoinFiatCurrencyHistories(0, 100, Math.ceil(Date.now() / 1000) - 3 * 24 * 60 * 60, Math.ceil(Date.now() / 1000))
  }
})

const getCoinFiatCurrencyHistories = (offset: number, limit: number, startAt: number, endAt: number) => {
  history.getCoinFiatCurrencyHistories({
    CoinTypeIDs: ids.value,
    Offset: offset,
    Limit: limit,
    StartAt: startAt,
    EndAt: endAt,
    Message: {}
  }, (error: boolean, rows?: coinfiatcurrencyhistory.CoinFiatCurrency[]) => {
    if (error || !rows?.length) {
      return
    }
    getCoinFiatCurrencyHistories(offset + limit, limit, startAt, endAt)
  })
}
</script>
