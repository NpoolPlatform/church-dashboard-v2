<template>
  <q-table
    dense
    flat
    :title='$t("MSG_DIRECT_BENEFIT_ADDRESS")'
    :rows='displayDirectBenefitAccounts'
    row-key='ID'
    :columns='directBenefitColumns'
    :rows-per-page-options='[20]'
    @row-click='(evt, row, index) => onRowClick(row as Account)'
  >
    <template #top-right>
      <div class='row indent flat'>
        <q-input
          dense
          flat
          class='small'
          v-model='username'
          :label='$t("MSG_USERNAME")'
        />
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
import { useLocalApplicationStore } from 'src/localstore'
import { computed, defineAsyncComponent, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const WithdrawDirectUpdate = defineAsyncComponent(() => import('src/components/account/WithdrawDirectUpdate.vue'))

const app = useLocalApplicationStore()
const appID = computed(() => app.AppID)

const account = useChurchUserAccountStore()
const directBenefitAccounts = computed(() => account.directBenefitAddress(appID.value))

const username = ref('')
const displayDirectBenefitAccounts = computed(() => {
  return directBenefitAccounts.value.filter((el) => el.EmailAddress?.toLowerCase()?.includes?.(username.value?.toLowerCase()) ||
                                              el.PhoneNO?.toLowerCase()?.includes?.(username.value?.toLowerCase())
  )
})

const updating = ref(true)
const showing = ref(false)
const target = ref({} as Account)

const onRowClick = (row: Account) => {
  updating.value = true
  showing.value = true
  target.value = { ...row }
}

watch(appID, () => {
  prepare()
})

onMounted(() => {
  prepare()
})

const prepare = () => {
  if (!account.UserAccounts.UserAccounts.get(appID.value)) {
    getNAppUserAccounts(0, 500)
  }
}

const directBenefitColumns = computed(() => [
  {
    name: 'AppID',
    label: t('MSG_APP_ID'),
    field: (row: Account) => row.ID
  },
  {
    name: 'ID',
    label: t('MSG_ID'),
    field: (row: Account) => row.AppID
  },
  {
    name: 'UserID',
    label: t('MSG_USER_ID'),
    field: (row: Account) => row.UserID
  },
  {
    name: 'CoinTypeID',
    label: t('MSG_DESCRIPTION'),
    field: (row: Account) => row.CoinTypeID
  },
  {
    name: 'CoinName',
    label: t('MSG_COIN_NAME'),
    field: (row: Account) => row.CoinName
  },
  {
    name: 'AccountID',
    label: t('MSG_ACCOUNT_ID'),
    field: (row: Account) => row.AccountID
  },
  {
    name: 'Address',
    label: t('MSG_ADDRESS'),
    field: (row: Account) => row.Address
  },
  {
    name: 'UsedFor',
    label: t('MSG_USED_FOR'),
    field: (row: Account) => row.UsedFor
  },
  {
    name: 'Labels',
    label: t('MSG_LABELS'),
    field: (row: Account) => row.Labels?.join(',')
  },
  {
    name: 'CreatedAt',
    label: t('MSG_CREATEDAT'),
    field: (row: Account) => row.CreatedAt
  },
  {
    name: 'EmailAddress',
    label: t('MSG_EMAIL_ADDRESS'),
    field: (row: Account) => row.EmailAddress
  },
  {
    name: 'PhoneNo',
    label: t('MSG_PHONE_NO'),
    field: (row: Account) => row.PhoneNO
  },
  {
    name: 'Active',
    label: t('MSG_ACTIVE'),
    field: (row: Account) => row.Active
  },
  {
    name: 'BLOCKED',
    label: t('MSG_BLOCKED'),
    field: (row: Account) => row.Blocked
  }
])
</script>
