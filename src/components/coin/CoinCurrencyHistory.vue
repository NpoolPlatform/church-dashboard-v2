<template>
  <q-table
    dense
    flat
    :rows='displayHistories'
    row-key='ID'
    :title='$t("MSG_COIN_CURRENCY_HISTORIES")'
    ::rows-per-page-options='[100]'
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
import { CoinCurrency, useCoinCurrencyHistoryStore } from 'npool-cli-v4'
import { computed, ref, defineProps, toRef, watch } from 'vue'
interface Props {
  ids: string[]
}

const props = defineProps<Props>()
const ids = toRef(props, 'ids')

const cch = useCoinCurrencyHistoryStore()
const cchs = computed(() => cch.Histories.Histories)

const name = ref('')
const displayHistories = computed(() => {
  return cchs.value.filter((el) => el.CoinName.toLowerCase()?.includes?.(name.value?.toLowerCase()))
})

watch(ids, () => {
  if (ids.value?.length > 0) {
    cch.$reset()
    getCoinCurrencyHistories(0, 100, 0, Math.ceil(Date.now() / 1000))
  }
})

const getCoinCurrencyHistories = (offset: number, limit: number, startAt: number, endAt: number) => {
  cch.getCurrencyHistories({
    CoinTypeIDs: ids.value,
    Offset: offset,
    Limit: limit,
    StartAt: startAt,
    EndAt: endAt,
    Message: {}
  }, (error: boolean, rows: CoinCurrency[]) => {
    if (error || rows.length === 0) {
      return
    }
    getCoinCurrencyHistories(offset + limit, limit, startAt, endAt)
  })
}
</script>
