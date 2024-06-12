<template>
  <q-table
    dense
    flat
    :title='$t("MSG_COIN_ALLOCATEDS")'
    :rows='displayCoinConfigs'
    :loading='loading'
    row-key='ID'
    :columns='columns'
    :rows-per-page-options='[100]'
  >
    <template #top-right>
      <q-input
        dense
        class='small'
        v-model='cointypeid'
        :label='$t("MSG_COIN_TYPE_ID")'
      />
      <q-input
        dense
        class='small'
        v-model='userid'
        :label='$t("MSG_USER_ID")'
      />
    </template>
  </q-table>
</template>

<script setup lang='ts'>
import { AppID } from 'src/api/app'
import { useI18n } from 'vue-i18n'
import { computed, onMounted, ref } from 'vue'
import { inspirecoinallocated, notify, utils } from 'src/npoolstore'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const _coinallocated = inspirecoinallocated.useCoinAllocatedStore()
const coinallocateds = computed(() => _coinallocated.coinAllocateds())

const cointypeid = ref('')
const userid = ref('')
const displayCoinConfigs = computed(() => coinallocateds.value.filter((el) => {
  return el.CoinTypeID?.includes(cointypeid.value) && el.UserID?.includes(userid.value)
}))

const loading = ref(false)

onMounted(() => {
  if (coinallocateds.value.length === 0) {
    getCoinAllocateds(0, 100)
  }
})

const getCoinAllocateds = (offset: number, limit: number) => {
  _coinallocated.adminGetCoinAllocateds({
    TargetAppID: AppID.value,
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: 'MSG_GET_COIN_ALLOCATEDS',
        Message: 'MSG_GET_COIN_ALLOCATEDS_FAIL',
        Popup: true,
        Type: notify.NotifyType.Error
      }
    }
  }, (error: boolean, rows?: Array<inspirecoinallocated.CoinAllocated>) => {
    if (error) {
      return
    }
    if (!rows?.length) {
      return
    }
    getCoinAllocateds(offset + limit, limit)
  })
}

const columns = computed(() => [
  {
    name: 'ID',
    label: t('MSG_ID'),
    sortable: true,
    field: (row: inspirecoinallocated.CoinAllocated) => row.ID
  },
  {
    name: 'EntID',
    label: t('MSG_ENT_ID'),
    sortable: true,
    field: (row: inspirecoinallocated.CoinAllocated) => row.EntID
  },
  {
    name: 'AppID',
    label: t('MSG_APP_ID'),
    sortable: true,
    field: (row: inspirecoinallocated.CoinAllocated) => row.AppID
  },
  {
    name: 'UserID',
    label: t('MSG_USER_ID'),
    sortable: true,
    field: (row: inspirecoinallocated.CoinAllocated) => row.UserID
  },
  {
    name: 'EmailAddress',
    label: t('MSG_EMAIL_ADDRESS'),
    sortable: true,
    field: (row: inspirecoinallocated.CoinAllocated) => row.EmailAddress
  },
  {
    name: 'PhoneNO',
    label: t('MSG_PHONE_NO'),
    sortable: true,
    field: (row: inspirecoinallocated.CoinAllocated) => row.PhoneNO
  },
  {
    name: 'CoinConfigID',
    label: t('MSG_COIN_CONFIG_ID'),
    sortable: true,
    field: (row: inspirecoinallocated.CoinAllocated) => row.CoinConfigID
  },
  {
    name: 'CoinTypeID',
    label: t('MSG_COIN_TYPE_ID'),
    sortable: true,
    field: (row: inspirecoinallocated.CoinAllocated) => row.CoinTypeID
  },
  {
    name: 'CoinAmount',
    label: t('MSG_COIN_AMOUNT'),
    sortable: true,
    field: (row: inspirecoinallocated.CoinAllocated) => row.CoinAmount
  },
  {
    name: 'CoinName',
    label: t('MSG_COIN_NAME'),
    sortable: true,
    field: (row: inspirecoinallocated.CoinAllocated) => row.CoinName
  },
  {
    name: 'DisplayNames',
    label: t('MSG_DISPLAY_NAMES'),
    sortable: true,
    field: (row: inspirecoinallocated.CoinAllocated) => row.DisplayNames.join(',')
  },
  {
    name: 'CoinLogo',
    label: t('MSG_COIN_LOGO'),
    sortable: true,
    field: (row: inspirecoinallocated.CoinAllocated) => row.CoinLogo
  },
  {
    name: 'CoinUnit',
    label: t('MSG_COIN_UNIT'),
    sortable: true,
    field: (row: inspirecoinallocated.CoinAllocated) => row.CoinUnit
  },
  {
    name: 'CreatedAt',
    label: t('MSG_CREATED_AT'),
    sortable: true,
    field: (row: inspirecoinallocated.CoinAllocated) => utils.formatTime(row.CreatedAt)
  }
])

</script>
