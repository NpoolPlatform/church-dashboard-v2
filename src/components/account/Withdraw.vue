<template>
  <q-table
    dense
    flat
    :title='$t("MSG_WITHDRAW_ADDRESS")'
    :rows='displayWithdrawAddress'
    row-key='ID'
    :columns='withdrawColumns'
    :rows-per-page-options='[100]'
    @row-click='(evt, row, index) => onRowClick(row as Account)'
  >
    <template #top>
      <div class='row justify-end table-right'>
        <TableHeaderFilter :backup='undefined' v-model:blocked='blocked' v-model:active='active' :locked='undefined' />
        <div class='row indent flat align-bottom'>
          <q-input
            dense
            flat
            class='small'
            v-model='username'
            :label='$t("MSG_USERNAME")'
          />
        </div>
      </div>
    </template>
  </q-table>
  <WithdrawDirectUpdate v-model:update='updating' v-model:visible='showing' v-model:account='target' />
</template>

<script setup lang='ts'>
import {
  Account,
  useChurchUserAccountStore
} from 'npool-cli-v4'
import { getNAppUserAccounts } from 'src/api/account'
import { AppID } from 'src/api/app'
import { computed, onMounted, watch, ref, defineAsyncComponent } from 'vue'
import { useI18n } from 'vue-i18n'
// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const WithdrawDirectUpdate = defineAsyncComponent(() => import('src/components/account/WithdrawDirectUpdate.vue'))
const TableHeaderFilter = defineAsyncComponent(() => import('src/components/account/TableHeaderFilter.vue'))

const account = useChurchUserAccountStore()
const withdrawAddress = computed(() => account.withdrawAddress(AppID.value))

const blocked = ref(null)
const active = ref(null)
const username = ref('')

const displayWithdrawAddress = computed(() => {
  return withdrawAddress.value.filter((el) => {
    let flag = el.EmailAddress?.toLowerCase()?.includes?.(username.value?.toLowerCase()) ||
                                              el.PhoneNO?.toLowerCase()?.includes?.(username.value?.toLowerCase())
    if (blocked.value !== null) {
      flag = flag && el.Blocked === blocked.value
    }
    if (active.value !== null) {
      flag = flag && el.Active === active.value
    }
    return flag
  })
})

const updating = ref(true)
const showing = ref(false)
const target = ref({} as Account)

const onRowClick = (row: Account) => {
  updating.value = true
  showing.value = true
  target.value = { ...row }
}

watch(AppID, () => {
  prepare()
})

onMounted(() => {
  prepare()
})

const prepare = () => {
  if (!account.UserAccounts.UserAccounts.get(AppID.value)) {
    getNAppUserAccounts(0, 500)
  }
}

const withdrawColumns = computed(() => [
  {
    name: 'ID',
    label: t('MSG_ID'),
    sortable: true,
    field: (row: Account) => row.ID
  },
  {
    name: 'ID',
    label: t('MSG_APP_ID'),
    sortable: true,
    field: (row: Account) => row.AppID
  },
  {
    name: 'UserID',
    label: t('MSG_USER_ID'),
    sortable: true,
    field: (row: Account) => row.UserID
  },
  {
    name: 'CoinTypeID',
    label: t('MSG_DESCRIPTION'),
    sortable: true,
    field: (row: Account) => row.CoinTypeID
  },
  {
    name: 'CoinName',
    label: t('MSG_COIN_NAME'),
    sortable: true,
    field: (row: Account) => row.CoinName
  },
  {
    name: 'AccountID',
    label: t('MSG_ACCOUNT_ID'),
    sortable: true,
    field: (row: Account) => row.AccountID
  },
  {
    name: 'Address',
    label: t('MSG_ADDRESS'),
    sortable: true,
    field: (row: Account) => row.Address
  },
  {
    name: 'UsedFor',
    label: t('MSG_USED_FOR'),
    sortable: true,
    field: (row: Account) => row.UsedFor
  },
  {
    name: 'Labels',
    label: t('MSG_LABELS'),
    sortable: true,
    field: (row: Account) => row.Labels?.join(',')
  },
  {
    name: 'CreatedAt',
    label: t('MSG_CREATEDAT'),
    sortable: true,
    field: (row: Account) => row.CreatedAt
  },
  {
    name: 'EmailAddress',
    label: t('MSG_EMAIL_ADDRESS'),
    sortable: true,
    field: (row: Account) => row.EmailAddress
  },
  {
    name: 'PhoneNo',
    label: t('MSG_PHONE_NO'),
    sortable: true,
    field: (row: Account) => row.PhoneNO
  },
  {
    name: 'Active',
    label: t('MSG_ACTIVE'),
    sortable: true,
    field: (row: Account) => row.Active
  },
  {
    name: 'BLOCKED',
    label: t('MSG_BLOCKED'),
    sortable: true,
    field: (row: Account) => row.Blocked
  }
])
</script>
<style lang='sass' scoped>
.table-right
  width: 100%
  ::v-deep .button
    line-height: 30px
    height: 30px
    margin-left: 10px
</style>
