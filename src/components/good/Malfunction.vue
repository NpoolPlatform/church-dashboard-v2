<template>
  <q-table
    dense
    flat
    :rows='goodCoins'
    row-key='ID'
    selection='multiple'
    :title='$t("MSG_GOOD_MALFUNCTIONS")'
    :rows-per-page-options='[20]'
    v-model:selected='selectedMalfunctions'
    :columns='coinColumns'
  >
    <template #top-right>
      <div class='row indent flat'>
        <q-btn
          dense
          flat
          class='btn flat'
          :label='$t("MSG_CREATE")'
          @click='onCreate'
        />
        <q-btn
          dense
          flat
          class='btn flat'
          :label='$t("MSG_DELETE")'
          :disable='(selectedMalfunctions.length === 0)'
          @click='onDelete'
        />
      </div>
    </template>
  </q-table>
  <q-dialog
    v-model='showing'
    @hide='onMenuHide'
    position='right'
  >
    <q-card class='popup-menu'>
      <q-card-section>
        <GoodSelector v-model:good-id='target.CoinTypeID' label='MSG_GOOD_ID' />
      </q-card-section>
      <q-item class='row'>
        <q-btn loading :label='$t("MSG_SUBMIT")' @click='onSubmit' />
        <q-btn class='btn round' :label='$t("MSG_CANCEL")' @click='onCancel' />
      </q-item>
    </q-card>
  </q-dialog>
</template>

<script setup lang='ts'>
import { computed, onMounted, ref, defineAsyncComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import { goodmalfunction, sdk } from 'src/npoolstore'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const GoodSelector = defineAsyncComponent(() => import('src/components/good/GoodSelector.vue'))

const goods = sdk.goods
const goodCoins = sdk.goodCoins

const showing = ref(false)
const updating = ref(false)
const target = ref({} as goodmalfunction.Malfunction)

const onCreate = () => {
  showing.value = true
  updating.value = false
}

const onCancel = () => {
  onMenuHide()
}

const onMenuHide = () => {
  showing.value = false
  target.value = {} as goodmalfunction.Malfunction
}

const onSubmit = () => {
  updating.value ? updateAppCoin() : createAppCoin()
}

const updateAppCoin = () => {
  // TODO
}

const createAppCoin = () => {
  sdk.adminCreateMalfunction(target.value, (error: boolean) => {
    if (error) return
    onMenuHide()
  })
}

const selectedMalfunctions = ref([] as Array<goodmalfunction.Malfunction>)
const selectedMalfunction = computed(() => selectedMalfunctions.value[0])

const onDelete = () => {
  sdk.adminDeleteMalfunction(selectedMalfunction.value)
}

onMounted(() => {
  if (!goods.value.length) {
    sdk.getGoods(0, 0)
  }
  if (!goodCoins.value.length) {
    sdk.getMalfunctions(0, 0)
  }
})

const coinColumns = computed(() => [
  {
    name: 'ID',
    label: t('MSG_ID'),
    sortable: true,
    field: (row: goodmalfunction.Malfunction) => row.ID
  },
  {
    name: 'EntID',
    label: t('MSG_ENT_ID'),
    sortable: true,
    field: (row: goodmalfunction.Malfunction) => row.EntID
  },
  {
    name: 'GoodName',
    label: t('MSG_GOOD_NAME'),
    sortable: true,
    field: (row: goodmalfunction.Malfunction) => row.GoodName
  },
  {
    name: 'GoodType',
    label: t('MSG_GOOD_TYPE'),
    sortable: true,
    field: (row: goodmalfunction.Malfunction) => row.GoodType
  },
  {
    name: 'Title',
    label: t('MSG_TITLE'),
    sortable: true,
    field: (row: goodmalfunction.Malfunction) => row.Title
  },
  {
    name: 'Message',
    label: t('MSG_MESSAGE'),
    sortable: true,
    field: (row: goodmalfunction.Malfunction) => row.Message
  },
  {
    name: 'StartAt',
    label: t('MSG_START_AT'),
    sortable: true,
    field: (row: goodmalfunction.Malfunction) => row.StartAt
  },
  {
    name: 'DurationSeconds',
    label: t('MSG_DURATION_SECONDS'),
    sortable: true,
    field: (row: goodmalfunction.Malfunction) => row.DurationSeconds
  },
  {
    name: 'CompensateSeconds',
    label: t('MSG_COMPENSATE_SECONDS'),
    sortable: true,
    field: (row: goodmalfunction.Malfunction) => row.CompensateSeconds
  },
  {
    name: 'CompensateOrders',
    label: t('MSG_COMPENSATE_ORDERS'),
    sortable: true,
    field: (row: goodmalfunction.Malfunction) => row.CompensateOrders
  }
])
</script>
