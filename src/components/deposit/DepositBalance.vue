<template>
  <q-table
    dense
    flat
    :title='$t("MSG_USERS")'
    :rows='displayUsers'
    row-key='ID'
    :loading='userLoading'
    :rows-per-page-options='[10]'
    selection='single'
    v-model:selected='selectedUser'
    :columns='columns'
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
      <div class='row indent flat'>
        <q-btn
          dense
          flat
          class='btn flat'
          :label='$t("MSG_DEPOSIT")'
          @click='onCreate'
          :disable='selectedUser.length === 0'
        />
      </div>
    </template>
  </q-table>
  <q-table
    dense
    flat
    :title='$t("MSG_GENERALS")'
    :rows='displayGenerals'
    row-key='ID'
    :rows-per-page-options='[10]'
    :columns='generalColumns'
  >
    <template #top-right>
      <div class='row indent flat'>
        <q-input
          dense
          flat
          class='small'
          v-model='generalUsername'
          :label='$t("MSG_USERNAME")'
        />
        <q-btn
          dense
          flat
          class='btn flat'
          :label='$t("MSG_EXPORT")'
          @click='generalsExport'
        />
      </div>
    </template>
  </q-table>
  <q-table
    dense
    flat
    :title='$t("MSG_DETAILS")'
    :rows='displayDetails'
    row-key='ID'
    :rows-per-page-options='[10]'
    :columns='detailColumns'
  >
    <template #top-right>
      <div class='row indent flat'>
        <q-input
          dense
          flat
          class='small'
          v-model='detailUsername'
          :label='$t("MSG_USERNAME")'
        />
        <q-btn
          flat
          class='btn flat'
          :label='$t("MSG_EXPORT")'
          @click='detailsExport'
        />
      </div>
    </template>
  </q-table>
  <q-table
    dense
    flat
    :title='$t("MSG_DEPOSIT_ACCOUNTS")'
    :rows='accounts'
    row-key='ID'
    :rows-per-page-options='[10]'
    :columns='accountColumns'
  >
    <template #top-right>
      <div class='row indent flat'>
        <q-input
          dense
          flat
          class='small'
          v-model='accountUsername'
          :label='$t("MSG_USERNAME")'
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
        <span>{{ $t('MSG_DEPOSIT_BALANCE') }}</span>
      </q-card-section>
      <q-card-section>
        <q-input
          type='number'
          :min='0'
          v-model='target.Amount'
          :label='$t("MSG_AMOUNT")'
        />
        <AppCoinPicker v-model:id='target.CoinTypeID' />
      </q-card-section>
      <q-item class='row'>
        <q-item-label>{{ $t("MSG_COIN_UNIT") }} : {{ selectedCoin?.Unit }}</q-item-label>
      </q-item>
      <q-item class='row'>
        <q-btn class='btn round alt' :label='$t("MSG_SUBMIT")' @click='onSubmit' :disabled='!target.Amount || !target.CoinTypeID || submitting' />
        <q-btn class='btn round' :label='$t("MSG_CANCEL")' @click='onCancel' />
      </q-item>
    </q-card>
  </q-dialog>
</template>

<script setup lang='ts'>
import { computed, defineAsyncComponent, onMounted, ref, watch } from 'vue'
import {
  Detail,
  formatTime,
  General,
  NotifyType,
  useChurchUserAccountStore,
  useChurchAppStore,
  useChurchDepositStore,
  useChurchDetailStore,
  useChurchGeneralStore,
  useChurchUserStore,
  User,
  useChurchAppCoinStore,
  Account
} from 'npool-cli-v4'
import { useLocalApplicationStore } from 'src/localstore'
import { useI18n } from 'vue-i18n'
import saveAs from 'file-saver'
import { getAppDepositAccounts } from 'src/api/account'
import { CreateAppUserDepositRequest } from 'npool-cli-v4/dist/store/church/ledger/ledger/types'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const AppCoinPicker = defineAsyncComponent(() => import('src/components/coin/AppCoinPicker.vue'))

const columns = computed(() => [
  {
    name: 'AppID',
    label: t('MSG_APP_ID'),
    field: (row: User) => row.AppID
  },
  {
    name: 'UserID',
    label: t('MSG_USER_ID'),
    field: (row: User) => row.ID
  },
  {
    name: 'EmailAddress',
    label: t('MSG_EMAIL_ADDRESS'),
    field: (row: User) => row.EmailAddress
  },
  {
    name: 'PhoneNO',
    label: t('MSG_PHONE_NO'),
    field: (row: User) => row.PhoneNO
  },
  {
    name: 'Roles',
    label: t('MSG_ROLES'),
    field: (row: User) => row.Roles.join(',')
  },
  {
    name: 'CreatedAt',
    label: t('MSG_CREATEDAT'),
    field: (row: User) => formatTime(row.CreatedAt)
  }
])

const coin = useChurchAppCoinStore()
const selectedCoin = computed(() => coin.getCoinByID(appID.value, target.value?.CoinTypeID))

const app = useLocalApplicationStore()
const appID = computed(() => app.AppID)

const target = ref({
  TargetAppID: appID.value
} as CreateAppUserDepositRequest)

const deposit = useChurchDepositStore()
const showing = ref(false)
const amount = ref(undefined)
const submitting = ref(false)
const onSubmit = () => {
  submitting.value = true
  deposit.createAppUserDeposit({
    ...target.value,
    TargetUserID: selectedUser.value[0].ID,
    Message: {
      Error: {
        Title: 'MSG_DEPOSIT_BALANCE',
        Message: 'MSG_DEPOSIT_BALANCE_FAIL',
        Popup: true,
        Type: NotifyType.Error
      },
      Info: {
        Title: 'MSG_DEPOSIT_BALANCE',
        Message: 'MSG_DEPOSIT_BALANCE_SUCCESS',
        Popup: true,
        Type: NotifyType.Success
      }
    }
  }, (resp: Detail, error: boolean) => {
    submitting.value = false
    if (error) {
      return
    }
    reset()
    onMenuHide()
  })
}

const reset = () => {
  general.$reset()
  detail.$reset()
  account.$reset()
  getAppGenerals(0, 500)
  getAppDetails(0, 500)
  getAppDepositAccounts(0, 500)
}

const onCancel = () => {
  onMenuHide()
}
const onCreate = () => {
  showing.value = true
}
const onMenuHide = () => {
  showing.value = false
  submitting.value = false
  amount.value = undefined
}

const user = useChurchUserStore()
const appUsers = computed(() => user.Users.get(appID.value) ? user.Users.get(appID.value) as Array<User> : [])
const username = ref('')
const displayUsers = computed(() => appUsers.value.filter((user) => user.EmailAddress?.includes(username.value) || user.PhoneNO?.includes(username.value)))
const selectedUser = ref([] as Array<User>)

const userLoading = ref(false)

const detailUsername = ref('')
const detail = useChurchDetailStore()
const displayDetails = computed(() => !detail.Details.Details.get(appID.value) ? [] : detail.Details.Details.get(appID.value)?.filter((el) => {
  return el.EmailAddress?.includes(detailUsername.value) || el.PhoneNO?.includes(detailUsername.value)
}))

const generalUsername = ref('')
const general = useChurchGeneralStore()
const displayGenerals = computed(() => !general.Generals.Generals.get(appID.value) ? [] : general.Generals.Generals.get(appID.value)?.filter((el) => {
  return el.EmailAddress?.includes(generalUsername.value) || el.PhoneNO?.includes(generalUsername.value)
}))

const accountUsername = ref('')
const account = useChurchUserAccountStore()
const accounts = computed(() => account.getDepositAccountsByAppID(appID.value).filter((el) => {
  return el.EmailAddress?.includes(accountUsername.value) || el.PhoneNO?.includes(accountUsername.value)
}))

const application = useChurchAppStore()
const generalsExport = () => {
  if (!displayGenerals.value || displayGenerals.value.length === 0) {
    return
  }
  let orderStr = ''
  let createdAtCol = 0
  let paidAtCol = 0
  let coinTypeID = 0
  displayGenerals.value.forEach((el) => {
    const obj = el as unknown as Record<string, unknown>
    if (!orderStr.length) {
      Object.keys(obj).forEach((k, col) => {
        if (orderStr.length) {
          orderStr += ','
        }
        if (k === 'CreatedAt') {
          createdAtCol = col
        }
        if (k === 'PaidAt') {
          paidAtCol = col
        }
        if (k === 'CoinTypeID') {
          coinTypeID = col
        }
        orderStr += k
      })
    }
    orderStr += '\n'
    let lineStr = ''
    Object.values(obj).forEach((v, col) => {
      if (lineStr.length) {
        lineStr += ','
      }
      if (col === coinTypeID) {
        lineStr += obj.CoinTypeID
        return
      }
      if (col === createdAtCol || col === paidAtCol) {
        lineStr += formatTime(Number(v), false)
        return
      }
      lineStr += v
    })
    orderStr += lineStr
  })

  const blob = new Blob([orderStr], { type: 'text/plain;charset=utf-8' })
  const filename = application.Apps.Apps.find((el) => el.ID === appID.value)?.Name as string + '-Generals-' +
                   formatTime(new Date().getTime() / 1000) +
                   '.csv'
  saveAs(blob, filename)
}
const detailsExport = () => {
  if (!displayDetails.value || displayDetails.value.length === 0) {
    return
  }
  let orderStr = ''
  let createdAtCol = 0
  let paidAtCol = 0
  let ioExtra = 0
  let coinTypeID = 0
  displayDetails.value.forEach((el) => {
    const obj = el as unknown as Record<string, unknown>
    if (!orderStr.length) {
      Object.keys(obj).forEach((k, col) => {
        if (orderStr.length) {
          orderStr += ','
        }
        if (k === 'CreatedAt') {
          createdAtCol = col
        }
        if (k === 'PaidAt') {
          paidAtCol = col
        }
        if (k === 'IOExtra') {
          ioExtra = col
        }
        if (k === 'CoinTypeID') {
          coinTypeID = col
        }
        orderStr += k
      })
    }
    orderStr += '\n'
    let lineStr = ''
    Object.values(obj).forEach((v, col) => {
      if (lineStr.length) {
        lineStr += ','
      }
      if (col === coinTypeID) {
        lineStr += obj.CoinTypeID
        return
      }
      if (col === createdAtCol || col === paidAtCol) {
        lineStr += formatTime(Number(v), false)
        return
      }
      if (col === ioExtra) {
        lineStr += (v as string).replace(/,/g, ';')
        return
      }

      lineStr += v
    })
    orderStr += lineStr
  })

  const blob = new Blob([orderStr], { type: 'text/plain;charset=utf-8' })
  // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
  const filename = application.Apps.Apps.find((el) => el.ID === appID.value)?.Name as string + '-Details-' + (new Date().getTime() / 1000) + '.csv'
  saveAs(blob, filename)
}

onMounted(() => {
  prepare()
})

const prepare = () => {
  if (!user.Users.get(appID.value)) {
    getAppUsers(0, 500)
  }
  if (!detail.Details.Details.get(appID.value)) {
    getAppDetails(0, 500)
  }
  if (!general.Generals.Generals.get(appID.value)) {
    getAppGenerals(0, 500)
  }
  if (accounts.value.length === 0) {
    getAppDepositAccounts(0, 100)
  }
}

watch(appID, () => {
  prepare()
})

const getAppUsers = (offset: number, limit: number) => {
  user.getAppUsers({
    TargetAppID: appID.value,
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: 'MSG_GET_USERS',
        Message: 'MSG_GET_USERS_FAIL',
        Popup: true,
        Type: NotifyType.Error
      }
    }
  }, (resp: Array<User>, error: boolean) => {
    if (error || resp.length < limit) {
      return
    }
    getAppUsers(offset + limit, limit)
  })
}

const getAppGenerals = (offset: number, limit: number) => {
  general.getAppGenerals({
    TargetAppID: appID.value,
    Offset: offset,
    Limit: limit,
    Message: {}
  }, (generals: Array<General>, error: boolean) => {
    if (error || generals.length < limit) {
      return
    }
    getAppGenerals(offset + limit, limit)
  })
}

const getAppDetails = (offset: number, limit: number) => {
  detail.getAppDetails({
    TargetAppID: appID.value,
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {}
    }
  }, (details: Array<Detail>, error: boolean) => {
    if (error || details.length < limit) {
      return
    }
    getAppDetails(offset + limit, limit)
  })
}

const generalColumns = computed(() => [
  {
    name: 'CoinTypeID',
    label: t('MSG_COIN_TYPE_ID'),
    field: (row: General) => row.CoinTypeID
  },
  {
    name: 'CoinName',
    label: t('MSG_COIN_NAME'),
    field: (row: General) => row.CoinName
  },
  {
    name: 'CoinUnit',
    label: t('MSG_COIN_UNIT'),
    field: (row: General) => row.CoinUnit
  },
  {
    name: 'Incoming',
    label: t('MSG_INCOMING'),
    field: (row: General) => row.Incoming
  },
  {
    name: 'Outcoming',
    label: t('MSG_OUT_COMING'),
    field: (row: General) => row.Outcoming
  },
  {
    name: 'Spendable',
    label: t('MSG_SPENDABLE'),
    field: (row: General) => row.Spendable
  },
  {
    name: 'Locked',
    label: t('MSG_LOCKED'),
    field: (row: General) => row.Locked
  },
  {
    name: 'UserID',
    label: t('MSG_USER_ID'),
    field: (row: General) => row.UserID
  },
  {
    name: 'EmailAddress',
    label: t('MSG_EMAIL_ADDRESS'),
    field: (row: General) => row.EmailAddress
  },
  {
    name: 'PhoneNO',
    label: t('MSG_PHONE_NO'),
    field: (row: General) => row.PhoneNO
  },
  {
    name: 'CoinDisabled',
    label: t('MSG_COIN_DISABLE'),
    field: (row: General) => row.CoinDisabled
  },
  {
    name: 'CoinDisplay',
    label: t('MSG_COIN_DISPLAY'),
    field: (row: General) => row.CoinDisplay
  }
])

const detailColumns = computed(() => [
  {
    name: 'CoinTypeID',
    label: t('MSG_COIN_TYPE_ID'),
    field: (row: Detail) => row.CoinTypeID
  },
  {
    name: 'CoinName',
    label: t('MSG_COIN_NAME'),
    field: (row: Detail) => row.CoinName
  },
  {
    name: 'CoinUnit',
    label: t('MSG_COIN_UNIT'),
    field: (row: Detail) => row.CoinUnit
  },
  {
    name: 'IOType',
    label: t('MSG_IO_TYPE'),
    field: (row: Detail) => row.IOType
  },
  {
    name: 'IOSubType',
    label: t('MSG_IO_SUB_TYPE'),
    field: (row: Detail) => row.IOSubType
  },
  {
    name: 'Amount',
    label: t('MSG_AMOUNT'),
    field: (row: Detail) => row.Amount
  },
  {
    name: 'IOExtra',
    align: 'left',
    label: t('MSG_IO_EXTRA'),
    field: (row: Detail) => row.IOExtra
  },
  {
    name: 'UserID',
    label: t('MSG_USER_ID'),
    field: (row: Detail) => row.UserID
  },
  {
    name: 'EmailAddress',
    label: t('MSG_EMAIL_ADDRESS'),
    field: (row: Detail) => row.EmailAddress
  },
  {
    name: 'PhoneNO',
    label: t('MSG_PHONE_NO'),
    field: (row: Detail) => row.PhoneNO
  }
])

const accountColumns = computed(() => [
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
    name: 'CoinName',
    label: t('MSG_COIN_NAME'),
    field: (row: Account) => row.CoinName
  },
  {
    name: 'CoinUnit',
    label: t('MSG_COIN_UNIT'),
    field: (row: Account) => row.CoinUnit
  },
  {
    name: 'Active',
    label: t('MSG_ACTIVE'),
    field: (row: Account) => row.Active
  },
  {
    name: 'Blocked',
    label: t('MSG_BLOCKED'),
    field: (row: Account) => row.Blocked
  },
  {
    name: 'UsedFor',
    label: t('MSG_USED_FOR'),
    field: (row: Account) => row.UsedFor
  },
  {
    name: 'UserID',
    label: t('MSG_USER_ID'),
    field: (row: Account) => row.UserID
  },
  {
    name: 'EmailAddress',
    label: t('MSG_EMAIL_ADDRESS'),
    field: (row: Detail) => row.EmailAddress
  },
  {
    name: 'PhoneNO',
    label: t('MSG_PHONE_NO'),
    field: (row: Account) => row.PhoneNO
  }
])
</script>
