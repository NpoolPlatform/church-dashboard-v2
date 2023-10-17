<template>
  <q-table
    dense
    flat
    :rows='displayHistories'
    row-key='ID'
    :title='$t("MSG_COIN_CURRENCY_HISTORIES")'
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
import { computed, ref, defineProps, toRef, watch } from 'vue'
import { coincurrencyhistory, coincurrencybase } from 'src/npoolstore'

interface Props {
  ids: string[]
}

const props = defineProps<Props>()
const ids = toRef(props, 'ids')

const history = coincurrencyhistory.useCoinCurrencyHistoryStore()
const histories = computed(() => history.histories())

const name = ref('')
const displayHistories = computed(() => {
  return histories.value.filter((el) => el.CoinName.toLowerCase()?.includes?.(name.value?.toLowerCase()))
})

watch(ids, () => {
  if (ids.value?.length > 0) {
    history.$reset()
    getCoinCurrencyHistories(0, 100, Math.ceil(Date.now() / 1000) - 3 * 24 * 60 * 60, Math.ceil(Date.now() / 1000))
  }
})

const getCoinCurrencyHistories = (offset: number, limit: number, startAt: number, endAt: number) => {
  history.getCurrencyHistories({
    CoinTypeIDs: ids.value,
    Offset: offset,
    Limit: limit,
    StartAt: startAt,
    EndAt: endAt,
    Message: {}
  }, (error: boolean, rows?: coincurrencybase.CoinCurrency[]) => {
    if (error || !rows?.length) {
      return
    }
    getCoinCurrencyHistories(offset + limit, limit, startAt, endAt)
  })
}
</script>
