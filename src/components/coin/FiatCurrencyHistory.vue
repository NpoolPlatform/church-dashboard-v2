<template>
  <q-table
    dense
    flat
    :rows='displayFiats'
    row-key='ID'
    :title='$t("MSG_FIATS")'
    :rows-per-page-options='[10]'
    selection='multiple'
    v-model:selected='selectedFiats'
    :columns='columns'
  >
    <template #top-right>
      <div class='row indent flat'>
        <q-input
          dense
          flat
          class='small'
          v-model='name'
          :label='$t("MSG")'
        />
      </div>
    </template>
  </q-table>
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
          v-model='name1'
          :label='$t("MSG_NAME")'
        />
      </div>
    </template>
  </q-table>
</template>

<script setup lang='ts'>
import { computed, onMounted, ref, watch } from 'vue'
import { useFiatCurrencyHistoryStore } from 'src/teststore/fiat/currency/history'
import { Currency } from 'src/teststore/fiat/currency/history/types'
import { useFiatStore } from 'src/teststore/fiat'
import { useI18n } from 'vue-i18n'
import { Fiat } from 'src/teststore/fiat/types'
import { formatTime } from 'npool-cli-v4'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const fiat = useFiatStore()
const fiats = computed(() => fiat.fiats())

const name = ref('')
const displayFiats = computed(() => {
  return fiats.value.filter((el) => el.Name?.toLowerCase()?.includes?.(name.value?.toLowerCase()) || el.ID?.toLowerCase()?.includes(name.value?.toLowerCase()))
})

const selectedFiats = ref([] as Array<Fiat>)
const fch = useFiatCurrencyHistoryStore()
const fchs = computed(() => fch.Histories.Histories)

const name1 = ref('')
const displayHistories = computed(() => {
  return fchs.value.filter((el) => el.FiatName?.toLowerCase()?.includes?.(name1.value?.toLowerCase()))
})

const ids = computed(() => {
  const _ids = [] as Array<string>
  selectedFiats.value?.forEach((el) => _ids.push(el.ID))
  return _ids
})

watch(ids, () => {
  if (selectedFiats.value?.length > 0) {
    fch.$reset()
    getFiatCurrencyHistories(0, 100, 0, Math.ceil(Date.now() / 1000))
  }
})

const getFiatCurrencyHistories = (offset: number, limit: number, startAt: number, endAt: number) => {
  fch.getHistories({
    FiatIDs: ids.value,
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

onMounted(() => {
  if (fiat.Fiats.Fiats.length === 0) {
    getFiats(0, 100)
  }
})

const getFiats = (offset: number, limit: number) => {
  fiat.getFiats({
    Offset: offset,
    Limit: limit,
    Message: {}
  }, (error: boolean, rows: Fiat[]) => {
    if (error || rows.length === 0) {
      return
    }
    getFiats(offset + limit, limit)
  })
}

const columns = computed(() => [
  {
    name: 'ID',
    label: t('MSG_ID'),
    field: (row: Fiat) => row.ID
  },
  {
    name: 'Name',
    label: t('MSG_NAME'),
    field: (row: Fiat) => row.Name
  },
  {
    name: 'Unit',
    label: t('MSG_UNIT'),
    field: (row: Fiat) => row.Unit
  },
  {
    name: 'Logo',
    label: t('MSG_LOGO'),
    field: (row: Fiat) => row.Logo
  },
  {
    name: 'CreatedAt',
    label: 'MSG_CREATED_AT',
    field: (row: Fiat) => formatTime(row.CreatedAt)
  },
  {
    name: 'UpdatedAt',
    label: 'MSG_UPDATED_AT',
    field: (row: Fiat) => formatTime(row.UpdatedAt)
  }
])
</script>
