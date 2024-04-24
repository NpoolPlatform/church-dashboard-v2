<template>
  <q-table
    dense
    flat
    :title='$t("MSG_USERS")'
    :rows='displayUsers'
    row-key='ID'
    :loading='userLoading'
    :rows-per-page-options='[100]'
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
    :rows-per-page-options='[100]'
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
    :rows-per-page-options='[100]'
    :columns='(detailColumns as any)'
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
    :rows-per-page-options='[100]'
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
  <q-table
    dense
    flat
    :title='$t("MSG_SIMULATE_GENERALS")'
    :rows='displaySimulateGenerals'
    row-key='ID'
    :rows-per-page-options='[100]'
    :columns='simulateGeneralColumns'
  >
    <template #top-right>
      <div class='row indent flat'>
        <q-input
          dense
          flat
          class='small'
          v-model='simulateGeneralUsername'
          :label='$t("MSG_USERNAME")'
        />
      </div>
    </template>
  </q-table>
  <q-table
    dense
    flat
    :title='$t("MSG_SIMULATE_DETAILS")'
    :rows='displaySimulateDetails'
    row-key='ID'
    :rows-per-page-options='[100]'
    :columns='(simulateDetailColumns as any)'
  >
    <template #top-right>
      <div class='row indent flat'>
        <q-input
          dense
          flat
          class='small'
          v-model='simulateDetailUsername'
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
import { AppID } from 'src/api/app'
import { useI18n } from 'vue-i18n'
import saveAs from 'file-saver'
import { getAppDepositAccounts } from 'src/api/account'
import { ledgerstatement, simulateledgerstatement, utils, ledger, simulateledger, notify, appcoin, useraccount, useraccountbase, user, app, accountbase } from 'src/npoolstore'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const AppCoinPicker = defineAsyncComponent(() => import('src/components/coin/AppCoinPicker.vue'))

const columns = computed(() => [
  {
    name: 'AppID',
    label: t('MSG_APP_ID'),
    sortable: true,
    field: (row: user.User) => row.AppID
  },
  {
    name: 'UserID',
    label: t('MSG_USER_ID'),
    sortable: true,
    field: (row: user.User) => row.EntID
  },
  {
    name: 'EmailAddress',
    label: t('MSG_EMAIL_ADDRESS'),
    sortable: true,
    field: (row: user.User) => row.EmailAddress
  },
  {
    name: 'PhoneNO',
    label: t('MSG_PHONE_NO'),
    sortable: true,
    field: (row: user.User) => row.PhoneNO
  },
  {
    name: 'Roles',
    label: t('MSG_ROLES'),
    sortable: true,
    field: (row: user.User) => row.Roles.join(',')
  },
  {
    name: 'CreatedAt',
    label: t('MSG_CREATEDAT'),
    sortable: true,
    field: (row: user.User) => utils.formatTime(row.CreatedAt)
  }
])

const coin = appcoin.useAppCoinStore()
const selectedCoin = computed(() => coin.coin(AppID.value, target.value.CoinTypeID))

const target = ref({
  TargetAppID: AppID.value
} as ledgerstatement.CreateAppUserDepositRequest)

watch(AppID, () => {
  target.value.TargetAppID = AppID.value
})

const statement = ledgerstatement.useStatementStore()
const simulatestatement = simulateledgerstatement.useStatementStore()
const showing = ref(false)
const amount = ref(undefined)
const submitting = ref(false)
const onSubmit = () => {
  submitting.value = true
  statement.createAppUserDeposit({
    ...target.value,
    TargetUserID: selectedUser.value[0].EntID,
    Message: {
      Error: {
        Title: 'MSG_DEPOSIT_BALANCE',
        Message: 'MSG_DEPOSIT_BALANCE_FAIL',
        Popup: true,
        Type: notify.NotifyType.Error
      },
      Info: {
        Title: 'MSG_DEPOSIT_BALANCE',
        Message: 'MSG_DEPOSIT_BALANCE_SUCCESS',
        Popup: true,
        Type: notify.NotifyType.Success
      }
    }
  }, (error: boolean) => {
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
  statement.$reset()
  account.$reset()
  getAppGenerals(0, 100)
  getAppDetails(0, 100)
  getAppDepositAccounts(0, 100)
  getAppSimulateGenerals(0, 100)
  getAppSimulateDetails(0, 100)
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

const _user = user.useUserStore()
const appUsers = computed(() => _user.appUsers(AppID.value))
const username = ref('')
const displayUsers = computed(() => appUsers.value.filter((user) => user.EmailAddress?.includes(username.value) || user.PhoneNO?.includes(username.value)))
const selectedUser = ref([] as Array<user.User>)

const userLoading = ref(false)

const detailUsername = ref('')
const displayDetails = computed(() => statement.statements(AppID.value).filter((el) => {
  return el.EmailAddress?.includes(detailUsername.value) || el.PhoneNO?.includes(detailUsername.value)
}))

const simulateDetailUsername = ref('')
const displaySimulateDetails = computed(() => simulatestatement.statements(AppID.value).filter((el) => {
  return el.EmailAddress?.includes(simulateDetailUsername.value) || el.PhoneNO?.includes(simulateDetailUsername.value)
}))

const generalUsername = ref('')
const general = ledger.useLedgerStore()
const displayGenerals = computed(() => general.ledgers(AppID.value).filter((el) => {
  return el.EmailAddress?.includes(generalUsername.value) || el.PhoneNO?.includes(generalUsername.value)
}))

const simulateGeneralUsername = ref('')
const simulategeneral = simulateledger.useLedgerStore()
const displaySimulateGenerals = computed(() => simulategeneral.ledgers(AppID.value).filter((el) => {
  return el.EmailAddress?.includes(simulateGeneralUsername.value) || el.PhoneNO?.includes(simulateGeneralUsername.value)
}))

const accountUsername = ref('')
const account = useraccount.useUserAccountStore()
const accounts = computed(() => account.accounts(AppID.value, undefined, undefined, accountbase.AccountUsedFor.UserDeposit).filter((el) => {
  return el.EmailAddress?.includes(accountUsername.value) || el.PhoneNO?.includes(accountUsername.value)
}))

const application = app.useApplicationStore()
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
        lineStr += utils.formatTime(Number(v))
        return
      }
      lineStr += v
    })
    orderStr += lineStr
  })

  const blob = new Blob([orderStr], { type: 'text/plain;charset=utf-8' })
  const filename = application.app(AppID.value)?.Name as string + '-Generals-' +
                   utils.formatTime(new Date().getTime() / 1000) +
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
        lineStr += utils.formatTime(Number(v))
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
  const filename = application.app(AppID.value)?.Name as string + '-Details-' + (new Date().getTime() / 1000) + '.csv'
  saveAs(blob, filename)
}

onMounted(() => {
  prepare()
})

const prepare = () => {
  if (!appUsers.value.length) {
    getAppUsers(0, 100)
  }
  if (!statement.statements(AppID.value).length) {
    getAppDetails(0, 100)
  }
  if (!general.ledgers(AppID.value).length) {
    getAppGenerals(0, 100)
  }
  if (!accounts.value.length) {
    getAppDepositAccounts(0, 100)
  }
  if (!simulatestatement.statements(AppID.value).length) {
    getAppSimulateDetails(0, 100)
  }
  if (!simulategeneral.ledgers(AppID.value).length) {
    getAppSimulateGenerals(0, 100)
  }
}

watch(AppID, () => {
  prepare()
})

const getAppUsers = (offset: number, limit: number) => {
  _user.getAppUsers({
    TargetAppID: AppID.value,
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: 'MSG_GET_USERS',
        Message: 'MSG_GET_USERS_FAIL',
        Popup: true,
        Type: notify.NotifyType.Error
      }
    }
  }, (error: boolean, rows?: Array<user.User>) => {
    if (error || !rows?.length) {
      return
    }
    getAppUsers(offset + limit, limit)
  })
}

const getAppGenerals = (offset: number, limit: number) => {
  general.getAppLedgers({
    TargetAppID: AppID.value,
    Offset: offset,
    Limit: limit,
    Message: {}
  }, (error: boolean, rows?: Array<ledger.Ledger>) => {
    if (error || !rows?.length) {
      return
    }
    getAppGenerals(offset + limit, limit)
  })
}

const getAppSimulateGenerals = (offset: number, limit: number) => {
  simulategeneral.getAppLedgers({
    TargetAppID: AppID.value,
    Offset: offset,
    Limit: limit,
    Message: {}
  }, (error: boolean, rows?: Array<simulateledger.Ledger>) => {
    if (error || !rows?.length) {
      return
    }
    getAppSimulateGenerals(offset + limit, limit)
  })
}

const getAppDetails = (offset: number, limit: number) => {
  statement.getAppStatements({
    TargetAppID: AppID.value,
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {}
    }
  }, (error: boolean, rows?: Array<ledgerstatement.Statement>) => {
    if (error || !rows?.length) {
      return
    }
    getAppDetails(offset + limit, limit)
  })
}

const getAppSimulateDetails = (offset: number, limit: number) => {
  simulatestatement.getAppStatements({
    TargetAppID: AppID.value,
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {}
    }
  }, (error: boolean, rows?: Array<ledgerstatement.Statement>) => {
    if (error || !rows?.length) {
      return
    }
    getAppSimulateDetails(offset + limit, limit)
  })
}

const generalColumns = computed(() => [
  {
    name: 'CoinTypeID',
    label: t('MSG_COIN_TYPE_ID'),
    sortable: true,
    field: (row: ledger.Ledger) => row.CoinTypeID
  },
  {
    name: 'CoinName',
    label: t('MSG_COIN_NAME'),
    sortable: true,
    field: (row: ledger.Ledger) => row.CoinName
  },
  {
    name: 'CoinUnit',
    label: t('MSG_COIN_UNIT'),
    sortable: true,
    field: (row: ledger.Ledger) => row.CoinUnit
  },
  {
    name: 'Incoming',
    label: t('MSG_INCOMING'),
    sortable: true,
    field: (row: ledger.Ledger) => row.Incoming
  },
  {
    name: 'Outcoming',
    label: t('MSG_OUT_COMING'),
    sortable: true,
    field: (row: ledger.Ledger) => row.Outcoming
  },
  {
    name: 'Spendable',
    label: t('MSG_SPENDABLE'),
    sortable: true,
    field: (row: ledger.Ledger) => row.Spendable
  },
  {
    name: 'Locked',
    label: t('MSG_LOCKED'),
    sortable: true,
    field: (row: ledger.Ledger) => row.Locked
  },
  {
    name: 'UserID',
    label: t('MSG_USER_ID'),
    sortable: true,
    field: (row: ledger.Ledger) => row.UserID
  },
  {
    name: 'EmailAddress',
    label: t('MSG_EMAIL_ADDRESS'),
    sortable: true,
    field: (row: ledger.Ledger) => row.EmailAddress
  },
  {
    name: 'PhoneNO',
    label: t('MSG_PHONE_NO'),
    sortable: true,
    field: (row: ledger.Ledger) => row.PhoneNO
  },
  {
    name: 'CoinDisabled',
    label: t('MSG_COIN_DISABLE'),
    sortable: true,
    field: (row: ledger.Ledger) => row.CoinDisabled
  },
  {
    name: 'CoinDisplay',
    label: t('MSG_COIN_DISPLAY'),
    sortable: true,
    field: (row: ledger.Ledger) => row.CoinDisplay
  }
])

const simulateGeneralColumns = computed(() => [
  {
    name: 'CoinTypeID',
    label: t('MSG_COIN_TYPE_ID'),
    sortable: true,
    field: (row: simulateledger.Ledger) => row.CoinTypeID
  },
  {
    name: 'CoinName',
    label: t('MSG_COIN_NAME'),
    sortable: true,
    field: (row: simulateledger.Ledger) => row.CoinName
  },
  {
    name: 'CoinUnit',
    label: t('MSG_COIN_UNIT'),
    sortable: true,
    field: (row: simulateledger.Ledger) => row.CoinUnit
  },
  {
    name: 'Incoming',
    label: t('MSG_INCOMING'),
    sortable: true,
    field: (row: simulateledger.Ledger) => row.Incoming
  },
  {
    name: 'Outcoming',
    label: t('MSG_OUT_COMING'),
    sortable: true,
    field: (row: simulateledger.Ledger) => row.Outcoming
  },
  {
    name: 'UserID',
    label: t('MSG_USER_ID'),
    sortable: true,
    field: (row: simulateledger.Ledger) => row.UserID
  },
  {
    name: 'EmailAddress',
    label: t('MSG_EMAIL_ADDRESS'),
    sortable: true,
    field: (row: simulateledger.Ledger) => row.EmailAddress
  },
  {
    name: 'PhoneNO',
    label: t('MSG_PHONE_NO'),
    sortable: true,
    field: (row: simulateledger.Ledger) => row.PhoneNO
  },
  {
    name: 'CoinDisabled',
    label: t('MSG_COIN_DISABLE'),
    sortable: true,
    field: (row: simulateledger.Ledger) => row.CoinDisabled
  },
  {
    name: 'CoinDisplay',
    label: t('MSG_COIN_DISPLAY'),
    sortable: true,
    field: (row: simulateledger.Ledger) => row.CoinDisplay
  }
])

const detailColumns = computed(() => [
  {
    name: 'CoinTypeID',
    label: t('MSG_COIN_TYPE_ID'),
    sortable: true,
    field: (row: ledgerstatement.Statement) => row.CoinTypeID
  },
  {
    name: 'CoinName',
    label: t('MSG_COIN_NAME'),
    sortable: true,
    field: (row: ledgerstatement.Statement) => row.CoinName
  },
  {
    name: 'CoinUnit',
    label: t('MSG_COIN_UNIT'),
    sortable: true,
    field: (row: ledgerstatement.Statement) => row.CoinUnit
  },
  {
    name: 'IOType',
    label: t('MSG_IO_TYPE'),
    sortable: true,
    field: (row: ledgerstatement.Statement) => row.IOType
  },
  {
    name: 'IOSubType',
    label: t('MSG_IO_SUB_TYPE'),
    sortable: true,
    field: (row: ledgerstatement.Statement) => row.IOSubType
  },
  {
    name: 'Amount',
    label: t('MSG_AMOUNT'),
    sortable: true,
    field: (row: ledgerstatement.Statement) => row.Amount
  },
  {
    name: 'IOExtra',
    align: 'left',
    label: t('MSG_IO_EXTRA'),
    sortable: true,
    field: (row: ledgerstatement.Statement) => row.IOExtra
  },
  {
    name: 'UserID',
    label: t('MSG_USER_ID'),
    sortable: true,
    field: (row: ledgerstatement.Statement) => row.UserID
  },
  {
    name: 'EmailAddress',
    label: t('MSG_EMAIL_ADDRESS'),
    sortable: true,
    field: (row: ledgerstatement.Statement) => row.EmailAddress
  },
  {
    name: 'PhoneNO',
    label: t('MSG_PHONE_NO'),
    sortable: true,
    field: (row: ledgerstatement.Statement) => row.PhoneNO
  }
])

const simulateDetailColumns = computed(() => [
  {
    name: 'CoinTypeID',
    label: t('MSG_COIN_TYPE_ID'),
    sortable: true,
    field: (row: simulateledgerstatement.Statement) => row.CoinTypeID
  },
  {
    name: 'CoinName',
    label: t('MSG_COIN_NAME'),
    sortable: true,
    field: (row: simulateledgerstatement.Statement) => row.CoinName
  },
  {
    name: 'CoinUnit',
    label: t('MSG_COIN_UNIT'),
    sortable: true,
    field: (row: simulateledgerstatement.Statement) => row.CoinUnit
  },
  {
    name: 'IOType',
    label: t('MSG_IO_TYPE'),
    sortable: true,
    field: (row: simulateledgerstatement.Statement) => row.IOType
  },
  {
    name: 'IOSubType',
    label: t('MSG_IO_SUB_TYPE'),
    sortable: true,
    field: (row: simulateledgerstatement.Statement) => row.IOSubType
  },
  {
    name: 'Amount',
    label: t('MSG_AMOUNT'),
    sortable: true,
    field: (row: simulateledgerstatement.Statement) => row.Amount
  },
  {
    name: 'IOExtra',
    align: 'left',
    label: t('MSG_IO_EXTRA'),
    sortable: true,
    field: (row: simulateledgerstatement.Statement) => row.IOExtra
  },
  {
    name: 'UserID',
    label: t('MSG_USER_ID'),
    sortable: true,
    field: (row: simulateledgerstatement.Statement) => row.UserID
  },
  {
    name: 'EmailAddress',
    label: t('MSG_EMAIL_ADDRESS'),
    sortable: true,
    field: (row: simulateledgerstatement.Statement) => row.EmailAddress
  },
  {
    name: 'PhoneNO',
    label: t('MSG_PHONE_NO'),
    sortable: true,
    field: (row: simulateledgerstatement.Statement) => row.PhoneNO
  },
  {
    name: 'Cashable',
    label: t('MSG_CASHABLE'),
    sortable: true,
    field: (row: simulateledgerstatement.Statement) => row.Cashable
  }
])

const accountColumns = computed(() => [
  {
    name: 'AccountID',
    label: t('MSG_ACCOUNT_ID'),
    sortable: true,
    field: (row: useraccountbase.Account) => row.AccountID
  },
  {
    name: 'Address',
    label: t('MSG_ADDRESS'),
    sortable: true,
    field: (row: useraccountbase.Account) => row.Address
  },
  {
    name: 'CoinName',
    label: t('MSG_COIN_NAME'),
    sortable: true,
    field: (row: useraccountbase.Account) => row.CoinName
  },
  {
    name: 'CoinUnit',
    label: t('MSG_COIN_UNIT'),
    sortable: true,
    field: (row: useraccountbase.Account) => row.CoinUnit
  },
  {
    name: 'Active',
    label: t('MSG_ACTIVE'),
    sortable: true,
    field: (row: useraccountbase.Account) => row.Active
  },
  {
    name: 'Blocked',
    label: t('MSG_BLOCKED'),
    sortable: true,
    field: (row: useraccountbase.Account) => row.Blocked
  },
  {
    name: 'UsedFor',
    label: t('MSG_USED_FOR'),
    sortable: true,
    field: (row: useraccountbase.Account) => row.UsedFor
  },
  {
    name: 'UserID',
    label: t('MSG_USER_ID'),
    sortable: true,
    field: (row: useraccountbase.Account) => row.UserID
  },
  {
    name: 'EmailAddress',
    label: t('MSG_EMAIL_ADDRESS'),
    sortable: true,
    field: (row: useraccountbase.Account) => row.EmailAddress
  },
  {
    name: 'PhoneNO',
    label: t('MSG_PHONE_NO'),
    sortable: true,
    field: (row: useraccountbase.Account) => row.PhoneNO
  }
])
</script>
