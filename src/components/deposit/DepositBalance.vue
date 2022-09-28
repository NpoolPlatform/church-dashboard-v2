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
    selection='single'
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
    selection='single'
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
      </div>
    </template>
  </q-table>
  <q-table
    dense
    flat
    :title='$t("MSG_DEPOSIT_ACCOUNTS")'
    :rows='displayAccounts'
    row-key='ID'
    :rows-per-page-options='[10]'
    selection='single'
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
          v-model='amount'
          :label='$t("MSG_AMOUNT")'
        />
        <q-select :options='displayCoins' v-model='selectedCoin' />
      </q-card-section>
      <q-item class='row'>
        <q-item-label>{{ $t("MSG_COIN_UNIT") }} : {{ selectedCoin?.value?.Unit }}</q-item-label>
      </q-item>
      <q-item class='row'>
        <q-btn class='btn round alt' :label='$t("MSG_SUBMIT")' @click='onSubmit' :disabled='!amount || !selectedCoin || submitting' />
        <q-btn class='btn round' :label='$t("MSG_CANCEL")' @click='onCancel' />
      </q-item>
    </q-card>
  </q-dialog>
</template>

<script setup lang='ts'>
import { computed, onMounted, ref, watch } from 'vue'
import { Account, Detail, formatTime, General, NotifyType, useChurchAccountStore, useChurchDepositStore, useChurchDetailStore, useChurchGeneralStore, useChurchUserStore, User } from 'npool-cli-v4'
import { useLocalApplicationStore } from 'src/localstore'
import { useI18n } from 'vue-i18n'
import { Coin, NotificationType, useCoinStore } from 'npool-cli-v2'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })
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

interface MyCoin {
  label: string
  value: Coin
}
const coin = useCoinStore()
const displayCoins = computed(() => Array.from(coin.Coins.filter((el) => !el.PreSale && !coinBlacklist(el.ID as string)), (el) => {
  return {
    label: el.Name,
    value: el
  } as MyCoin
}))
const selectedCoin = ref(undefined as unknown as MyCoin)
const coinBlacklist = (coinTypeID: string) => {
  const names = ['Ethereum', 'Tron', 'Solana', 'USD Coin']
  const existingItem = coin.Coins.find((el) => el.ID === coinTypeID)
  if (!existingItem) {
    return true
  }
  let flag = false
  names.forEach((el) => {
    if (existingItem.Name?.toLowerCase().includes(el.toLowerCase())) {
      flag = true
    }
  })
  return flag
}

const deposit = useChurchDepositStore()
const showing = ref(false)
const amount = ref(undefined)
const submitting = ref(false)
const onSubmit = () => {
  if (!amount.value || !selectedCoin.value) {
    return
  }
  submitting.value = true
  deposit.createAppUserDeposit({
    TargetAppID: appID.value,
    TargetUserID: selectedUser.value[0].ID,
    CoinTypeID: selectedCoin.value.value.ID as string,
    Amount: amount.value,
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
  }, (detail: Detail, error: boolean) => {
    submitting.value = false
    if (error) {
      return
    }
    onMenuHide()
  })
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
}

const app = useLocalApplicationStore()
const appID = computed(() => app.AppID)

const user = useChurchUserStore()
const appUsers = computed(() => user.Users.get(appID.value) ? user.Users.get(appID.value) as Array<User> : [])
const username = ref('')
const displayUsers = computed(() => appUsers.value.filter((user) => user.EmailAddress?.includes(username.value) || user.PhoneNO?.includes(username.value)))
const selectedUser = ref([] as Array<User>)

const userLoading = ref(false)

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
  if (!account.Accounts.Accounts.get(appID.value)) {
    getAppDepositAccounts(0, 100)
  }
}

watch(appID, () => {
  prepare()
})

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
const account = useChurchAccountStore()
const displayAccounts = computed(() => !account.Accounts.Accounts.get(appID.value) ? [] : account.Accounts.Accounts.get(appID.value)?.filter((el) => {
  return el.EmailAddress?.includes(accountUsername.value) || el.PhoneNO?.includes(accountUsername.value)
}))

onMounted(() => {
  prepare()
  if (coin.Coins.length === 0) {
    getCoins()
  }
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

const getCoins = () => {
  coin.getCoins({
    Message: {
      Error: {
        Title: 'MSG_GET_COINS',
        Message: 'MSG_GET_COINS_FAIL',
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, () => {
    // TODO
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

const getAppDepositAccounts = (offset: number, limit: number) => {
  account.getAppDepositAccounts({
    TargetAppID: appID.value,
    Offset: offset,
    Limit: limit,
    Message: {}
  }, (accounts: Array<Account>, error: boolean) => {
    if (error || accounts.length < limit) {
      return
    }
    getAppDepositAccounts(offset + limit, limit)
  })
}
</script>
