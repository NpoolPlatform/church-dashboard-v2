<template>
  <q-table
    dense
    flat
    :rows='displayFiats'
    row-key='ID'
    :title='$t("MSG_FIATS")'
    :rows-per-page-options='[100]'
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
    :rows-per-page-options='[100]'
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
import { useI18n } from 'vue-i18n'
import { fiatcurrencyhistory, fiat, fiatcurrency, utils } from 'src/npoolstore'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const _fiat = fiat.useFiatStore()
const fiats = computed(() => _fiat.fiats())

const name = ref('')
const displayFiats = computed(() => fiats.value.filter((el) => {
  return el.Name?.toLowerCase()?.includes?.(name.value?.toLowerCase()) ||
        el.EntID?.toLowerCase()?.includes(name.value?.toLowerCase())
}))

const selectedFiats = ref([] as Array<fiat.Fiat>)
const history = fiatcurrencyhistory.useFiatCurrencyHistoryStore()
const histories = computed(() => history.histories())

const name1 = ref('')
const displayHistories = computed(() => {
  return histories.value.filter((el) => el.FiatName?.toLowerCase()?.includes?.(name1.value?.toLowerCase()))
})

const ids = computed(() => {
  const _ids = [] as Array<string>
  selectedFiats.value?.forEach((el) => _ids.push(el.EntID))
  return _ids
})

watch(ids, () => {
  if (selectedFiats.value?.length > 0) {
    history.$reset()
    getFiatCurrencyHistories(0, 100, Math.ceil(Date.now() / 1000) - 3 * 24 * 60 * 60, Math.ceil(Date.now() / 1000))
  }
})

const getFiatCurrencyHistories = (offset: number, limit: number, startAt: number, endAt: number) => {
  history.getFiatCurrencyHistories({
    FiatIDs: ids.value,
    Offset: offset,
    Limit: limit,
    StartAt: startAt,
    EndAt: endAt,
    Message: {}
  }, (error: boolean, rows?: fiatcurrency.FiatCurrency[]) => {
    if (error || !rows?.length) {
      return
    }
    getFiatCurrencyHistories(offset + limit, limit, startAt, endAt)
  })
}

onMounted(() => {
  if (!fiats.value.length) {
    getFiats(0, 100)
  }
})

const getFiats = (offset: number, limit: number) => {
  _fiat.getFiats({
    Offset: offset,
    Limit: limit,
    Message: {}
  }, (error: boolean, rows?: fiat.Fiat[]) => {
    if (error || !rows?.length) {
      return
    }
    getFiats(offset + limit, limit)
  })
}

const columns = computed(() => [
  {
    name: 'ID',
    label: t('MSG_ID'),
    sortable: true,
    field: (row: fiat.Fiat) => row.ID
  },
  {
    name: 'EntID',
    label: t('MSG_ENT_ID'),
    sortable: true,
    field: (row: fiat.Fiat) => row.EntID
  },
  {
    name: 'Name',
    label: t('MSG_NAME'),
    sortable: true,
    field: (row: fiat.Fiat) => row.Name
  },
  {
    name: 'Unit',
    label: t('MSG_UNIT'),
    sortable: true,
    field: (row: fiat.Fiat) => row.Unit
  },
  {
    name: 'Logo',
    label: t('MSG_LOGO'),
    sortable: true,
    field: (row: fiat.Fiat) => row.Logo
  },
  {
    name: 'CreatedAt',
    label: 'MSG_CREATED_AT',
    sortable: true,
    field: (row: fiat.Fiat) => utils.formatTime(row.CreatedAt)
  },
  {
    name: 'UpdatedAt',
    label: 'MSG_UPDATED_AT',
    sortable: true,
    field: (row: fiat.Fiat) => utils.formatTime(row.UpdatedAt)
  }
])
</script>
