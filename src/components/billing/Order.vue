<template>
  <q-table
    dense
    flat
    :title='$t("MSG_ORDERS")'
    :rows='displayOrders'
    row-key='ID'
    :columns='columns'
    :rows-per-page-options='[constant.DefaultPageSize]'
  >
    <template #top-right>
      <select class='order-type' name='order-type' v-model='selectedOrderType'>
        <option v-for='value in order.OrderTypes' :key='value'>
          {{ value }}
        </option>
      </select>
      <q-toggle dense v-model='showSimulate' :label='$t("MSG_SHOW_SIMULATE")' size='xs' />
      <q-input
        dense
        class='small'
        v-model='goodID'
        :label='$t("MSG_GOOD_ID")'
      />
      <q-input
        dense
        class='small'
        type='date'
        v-model='start'
        :label='$t("MSG_START")'
      />
      <q-input
        dense
        class='small'
        type='date'
        v-model='end'
        :label='$t("MSG_END")'
      />
    </template>
  </q-table>
</template>

<script setup lang='ts'>
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { utils, constant, sdk, order } from 'src/npoolstore'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const goodID = ref('')
const start = ref('')
const end = ref('')
const selectedOrderType = ref('ALL')

const showSimulate = ref(false)

const orders = sdk.orders
const displayOrders = computed(() => orders.value.filter((el) => {
  let display = el.GoodID.includes(goodID.value)
  if (start.value.length) {
    display = display && (el.CreatedAt >= new Date(start.value).getTime() / 1000)
  }
  if (end.value.length) {
    display = display && (el.CreatedAt <= new Date(end.value).getTime() / 1000)
  }
  if (selectedOrderType.value !== 'ALL') {
    display = display && (el.OrderType === selectedOrderType.value)
  }
  display = display && (el.Simulate === showSimulate.value)
  return display
}))

onMounted(() => {
  if (!orders.value.length) {
    sdk.adminGetOrders(0, 0)
  }
})

const columns = computed(() => [
  {
    name: 'ID',
    label: t('MSG_ID'),
    sortable: true,
    field: (row: order.Order) => row.ID
  },
  {
    name: 'EntID',
    label: t('MSG_ENT_ID'),
    sortable: true,
    field: (row: order.Order) => row.EntID
  },
  {
    name: 'AppID',
    label: t('MSG_APP_ID'),
    sortable: true,
    field: (row: order.Order) => row.AppID
  },
  {
    name: 'GoodID',
    label: t('MSG_GOOD_ID'),
    sortable: true,
    field: (row: order.Order) => row.GoodID
  },
  {
    name: 'GoodName',
    label: t('MSG_GOOD_NAME'),
    sortable: true,
    field: (row: order.Order) => row.GoodName
  },
  {
    name: 'Type',
    label: t('MSG_TYPE'),
    sortable: true,
    field: (row: order.Order) => row.OrderType
  },
  {
    name: 'State',
    label: t('MSG_CONTENT'),
    sortable: true,
    field: (row: order.Order) => row.OrderState
  },
  {
    name: 'UserID',
    label: t('MSG_USER_ID'),
    sortable: true,
    field: (row: order.Order) => row.UserID
  },
  {
    name: 'EmailAddress',
    label: t('MSG_EMAIL_ADDRESS'),
    sortable: true,
    field: (row: order.Order) => row.EmailAddress
  },
  {
    name: 'PhoneNO',
    label: t('MSG_PHONE_NO'),
    sortable: true,
    field: (row: order.Order) => row.PhoneNO
  },
  {
    name: 'CreatedAt',
    label: t('MSG_CREATED_AT'),
    sortable: true,
    field: (row: order.Order) => utils.formatTime(row.CreatedAt)
  },
  {
    name: 'Start',
    label: t('MSG_START'),
    sortable: true,
    field: (row: order.Order) => utils.formatTime(row.StartAt)
  }
])
</script>
<style scoped>
select {
  border: none;
  outline: none
}
.cancel-order-tip {
  color: #34b6e0
}
</style>
