<template>
  <q-table
    dense
    flat
    :rows='displayHistories'
    row-key='ID'
    :title='$t("MSG_FIAT_CURRENCY_HISTORIES")'
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
import { useFiatCurrencyHistoryStore } from 'src/teststore/fiat/currency/history'
import { Currency } from 'src/teststore/fiat/currency/history/types'

const fch = useFiatCurrencyHistoryStore()
const fchs = computed(() => fch.Histories.Histories)

const name = ref('')
const displayHistories = computed(() => {
  return fchs.value.filter((el) => el.FiatName?.toLowerCase()?.includes?.(name.value?.toLowerCase()))
})

onMounted(() => {
  if (fch.Histories.Histories.length === 0) {
    getFiatCurrencyHistories(0, 100, 0, new Date().getTime())
  }
})

const getFiatCurrencyHistories = (offset: number, limit: number, startAt: number, endAt: number) => {
  fch.getHistories({
    FiatIDs: [''], // TODO
    Offset: offset,
    Limit: limit,
    StartAt: startAt,
    EndAt: endAt,
    Message: {}
  }, (error: boolean, rows: Currency[]) => {
    if (error || rows.length === 0) {
      return
    }
    getFiatCurrencyHistories(offset + limit, limit, startAt, endAt)
  })
}
</script>
