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
import { useCoinFiatCurrencyHistoryStore, CoinFiatCurrency } from 'npool-cli-v4'
import { computed, defineProps, ref, watch, toRef } from 'vue'

interface Props {
  ids: string[]
}

const props = defineProps<Props>()
const ids = toRef(props, 'ids')

const cfch = useCoinFiatCurrencyHistoryStore()
const cfchs = computed(() => cfch.Histories.Histories)

const name = ref('')
const displayHistories = computed(() => {
  return cfchs.value.filter((el) => el.CoinName.toLowerCase()?.includes?.(name.value?.toLowerCase()))
})

watch(ids, () => {
  if (ids.value?.length > 0) {
    cfch.$reset()
    getCoinFiatCurrencyHistories(0, 100, 0, Math.ceil(Date.now() / 1000))
  }
})

const getCoinFiatCurrencyHistories = (offset: number, limit: number, startAt: number, endAt: number) => {
  cfch.getCoinFiatCurrencyHistories({
    CoinTypeIDs: ids.value,
    Offset: offset,
    Limit: limit,
    StartAt: startAt,
    EndAt: endAt,
    Message: {}
  }, (error: boolean, rows: CoinFiatCurrency[]) => {
    if (error || rows.length === 0) {
      return
    }
    getCoinFiatCurrencyHistories(offset + limit, limit, startAt, endAt)
  })
}
</script>
