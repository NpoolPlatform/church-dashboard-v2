<template>
  <q-table
    dense
    flat
    :title='$t("MSG_USER_REWARDS")'
    :rows='displayUserRewards'
    :loading='loading'
    row-key='ID'
    :columns='userRewardColumns'
    :rows-per-page-options='[100]'
  >
    <template #top-right>
      <q-input
        dense
        class='small'
        v-model='rewarduserid'
        :label='$t("MSG_USER_ID")'
      />
    </template>
  </q-table>
  <q-table
    dense
    flat
    :title='$t("MSG_USER_COIN_REWARDS")'
    :rows='displayUserCoinRewards'
    :loading='loading'
    row-key='ID'
    :columns='userCoinRewardColumns'
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
  <q-table
    dense
    flat
    :title='$t("MSG_COIN_ALLOCATED")'
    :rows='displayCoinAllocateds'
    :loading='loading'
    row-key='ID'
    :columns='coinAllocatedColumns'
    :rows-per-page-options='[100]'
  >
    <template #top-right>
      <q-input
        dense
        class='small'
        v-model='coinallocatedcointypeid'
        :label='$t("MSG_COIN_TYPE_ID")'
      />
      <q-input
        dense
        class='small'
        v-model='coinallocateduserid'
        :label='$t("MSG_USER_ID")'
      />
    </template>
  </q-table>
  <q-table
    dense
    flat
    :title='$t("MSG_CREDIT_ALLOCATED")'
    :rows='displayCreditAllocateds'
    :loading='loading'
    row-key='ID'
    :columns='creditAllocatedColumns'
    :rows-per-page-options='[100]'
  >
    <template #top-right>
      <q-input
        dense
        class='small'
        v-model='creditallocateduserid'
        :label='$t("MSG_USER_ID")'
      />
    </template>
  </q-table>
</template>

<script setup lang='ts'>
import { AppID } from 'src/npoolstore/sdk'
import { useI18n } from 'vue-i18n'
import { computed, onMounted, ref } from 'vue'
import { inspireuserreward, inspireusercoinreward, inspirecoinallocated, inspirecreditallocated, notify, utils } from 'src/npoolstore'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const _userreward = inspireuserreward.useUserRewardStore()
const userrewards = computed(() => _userreward.userRewards())

const _usercoinreward = inspireusercoinreward.useUserCoinRewardStore()
const usercoinrewards = computed(() => _usercoinreward.userCoinRewards())

const _coinallocated = inspirecoinallocated.useCoinAllocatedStore()
const coinallocateds = computed(() => _coinallocated.coinAllocateds())

const coinallocatedcointypeid = ref('')
const coinallocateduserid = ref('')
const displayCoinAllocateds = computed(() => coinallocateds.value.filter((el) => {
  return el.CoinTypeID?.includes(coinallocatedcointypeid.value) && el.UserID?.includes(coinallocateduserid.value)
}))

const _creditallocated = inspirecreditallocated.useCreditAllocatedStore()
const creditallocateds = computed(() => _creditallocated.creditAllocateds())

const creditallocateduserid = ref('')
const displayCreditAllocateds = computed(() => creditallocateds.value.filter((el) => {
  return el.UserID?.includes(creditallocateduserid.value)
}))

const rewarduserid = ref('')
const displayUserRewards = computed(() => userrewards.value.filter((el) => {
  return el.UserID?.includes(rewarduserid.value)
}))

const cointypeid = ref('')
const userid = ref('')
const displayUserCoinRewards = computed(() => usercoinrewards.value.filter((el) => {
  return el.CoinTypeID?.includes(cointypeid.value) && el.UserID?.includes(userid.value)
}))

const loading = ref(false)

onMounted(() => {
  if (userrewards.value.length === 0) {
    getUserRewards(0, 100)
    getUserCoinRewards(0, 100)
    getCoinAllocateds(0, 100)
    getCreditAllocateds(0, 100)
  }
})

const getUserRewards = (offset: number, limit: number) => {
  _userreward.adminGetUserRewards({
    TargetAppID: AppID.value,
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: 'MSG_GET_USER_REWARDS',
        Message: 'MSG_GET_USER_REWARDS_FAIL',
        Popup: true,
        Type: notify.NotifyType.Error
      }
    }
  }, (error: boolean, rows?: Array<inspireuserreward.UserReward>) => {
    if (error) {
      return
    }
    if (!rows?.length) {
      return
    }
    getUserRewards(offset + limit, limit)
  })
}

const getUserCoinRewards = (offset: number, limit: number) => {
  _usercoinreward.adminGetUserCoinRewards({
    TargetAppID: AppID.value,
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: 'MSG_GET_USER_COIN_REWARDS',
        Message: 'MSG_GET_USER_COIN_REWARDS_FAIL',
        Popup: true,
        Type: notify.NotifyType.Error
      }
    }
  }, (error: boolean, rows?: Array<inspireusercoinreward.UserCoinReward>) => {
    if (error) {
      return
    }
    if (!rows?.length) {
      return
    }
    getUserCoinRewards(offset + limit, limit)
  })
}

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

const getCreditAllocateds = (offset: number, limit: number) => {
  _creditallocated.adminGetCreditAllocateds({
    TargetAppID: AppID.value,
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: 'MSG_GET_CREDIT_ALLOCATEDS',
        Message: 'MSG_GET_CREDIT_ALLOCATEDS_FAIL',
        Popup: true,
        Type: notify.NotifyType.Error
      }
    }
  }, (error: boolean, rows?: Array<inspirecreditallocated.CreditAllocated>) => {
    if (error) {
      return
    }
    if (!rows?.length) {
      return
    }
    getCreditAllocateds(offset + limit, limit)
  })
}

const userRewardColumns = computed(() => [
  {
    name: 'ID',
    label: t('MSG_ID'),
    sortable: true,
    field: (row: inspireuserreward.UserReward) => row.ID
  },
  {
    name: 'EntID',
    label: t('MSG_ENT_ID'),
    sortable: true,
    field: (row: inspireuserreward.UserReward) => row.EntID
  },
  {
    name: 'AppID',
    label: t('MSG_APP_ID'),
    sortable: true,
    field: (row: inspireuserreward.UserReward) => row.AppID
  },
  {
    name: 'UserID',
    label: t('MSG_USER_ID'),
    sortable: true,
    field: (row: inspireuserreward.UserReward) => row.UserID
  },
  {
    name: 'ActionCredits',
    label: t('MSG_ACTION_CREDITS'),
    sortable: true,
    field: (row: inspireuserreward.UserReward) => row.ActionCredits
  },
  {
    name: 'CouponAmount',
    label: t('MSG_COUPON_AMOUNT'),
    sortable: true,
    field: (row: inspireuserreward.UserReward) => row.CouponAmount
  },
  {
    name: 'CouponCashableAmount',
    label: t('MSG_COUPON_CASHABLE_AMOUNT'),
    sortable: true,
    field: (row: inspireuserreward.UserReward) => row.CouponCashableAmount
  },
  {
    name: 'CreatedAt',
    label: t('MSG_CREATED_AT'),
    sortable: true,
    field: (row: inspireuserreward.UserReward) => utils.formatTime(row.CreatedAt)
  }
])

const userCoinRewardColumns = computed(() => [
  {
    name: 'ID',
    label: t('MSG_ID'),
    sortable: true,
    field: (row: inspireusercoinreward.UserCoinReward) => row.ID
  },
  {
    name: 'EntID',
    label: t('MSG_ENT_ID'),
    sortable: true,
    field: (row: inspireusercoinreward.UserCoinReward) => row.EntID
  },
  {
    name: 'AppID',
    label: t('MSG_APP_ID'),
    sortable: true,
    field: (row: inspireusercoinreward.UserCoinReward) => row.AppID
  },
  {
    name: 'UserID',
    label: t('MSG_USER_ID'),
    sortable: true,
    field: (row: inspireusercoinreward.UserCoinReward) => row.UserID
  },
  {
    name: 'CoinTypeID',
    label: t('MSG_COIN_TYPE_ID'),
    sortable: true,
    field: (row: inspireusercoinreward.UserCoinReward) => row.CoinTypeID
  },
  {
    name: 'CoinRewards',
    label: t('MSG_COIN_REWARDS'),
    sortable: true,
    field: (row: inspireusercoinreward.UserCoinReward) => row.CoinRewards
  },
  {
    name: 'CoinName',
    label: t('MSG_COIN_NAME'),
    sortable: true,
    field: (row: inspireusercoinreward.UserCoinReward) => row.CoinName
  },
  {
    name: 'DisplayNames',
    label: t('MSG_DISPLAY_NAMES'),
    sortable: true,
    field: (row: inspireusercoinreward.UserCoinReward) => row.DisplayNames.join(',')
  },
  {
    name: 'CoinLogo',
    label: t('MSG_COIN_LOGO'),
    sortable: true,
    field: (row: inspireusercoinreward.UserCoinReward) => row.CoinLogo
  },
  {
    name: 'CoinUnit',
    label: t('MSG_COIN_UNIT'),
    sortable: true,
    field: (row: inspireusercoinreward.UserCoinReward) => row.CoinUnit
  },
  {
    name: 'CreatedAt',
    label: t('MSG_CREATED_AT'),
    sortable: true,
    field: (row: inspireusercoinreward.UserCoinReward) => utils.formatTime(row.CreatedAt)
  }
])

const coinAllocatedColumns = computed(() => [
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
    label: t('MSG_PHONENO'),
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
    name: 'CoinAmount',
    label: t('MSG_COIN_AMOUNT'),
    sortable: true,
    field: (row: inspirecoinallocated.CoinAllocated) => row.CoinAmount
  },
  {
    name: 'Extra',
    label: t('MSG_EXTRA'),
    sortable: true,
    field: (row: inspirecoinallocated.CoinAllocated) => row.Extra
  },
  {
    name: 'CreatedAt',
    label: t('MSG_CREATED_AT'),
    sortable: true,
    field: (row: inspirecoinallocated.CoinAllocated) => utils.formatTime(row.CreatedAt)
  }
])

const creditAllocatedColumns = computed(() => [
  {
    name: 'ID',
    label: t('MSG_ID'),
    sortable: true,
    field: (row: inspirecreditallocated.CreditAllocated) => row.ID
  },
  {
    name: 'EntID',
    label: t('MSG_ENT_ID'),
    sortable: true,
    field: (row: inspirecreditallocated.CreditAllocated) => row.EntID
  },
  {
    name: 'AppID',
    label: t('MSG_APP_ID'),
    sortable: true,
    field: (row: inspirecreditallocated.CreditAllocated) => row.AppID
  },
  {
    name: 'UserID',
    label: t('MSG_USER_ID'),
    sortable: true,
    field: (row: inspirecreditallocated.CreditAllocated) => row.UserID
  },
  {
    name: 'EmailAddress',
    label: t('MSG_EMAIL_ADDRESS'),
    sortable: true,
    field: (row: inspirecreditallocated.CreditAllocated) => row.EmailAddress
  },
  {
    name: 'PhoneNO',
    label: t('MSG_PHONENO'),
    sortable: true,
    field: (row: inspirecreditallocated.CreditAllocated) => row.PhoneNO
  },
  {
    name: 'Credits',
    label: t('MSG_CREDITS'),
    sortable: true,
    field: (row: inspirecreditallocated.CreditAllocated) => row.Credits
  },
  {
    name: 'Extra',
    label: t('MSG_EXTRA'),
    sortable: true,
    field: (row: inspirecreditallocated.CreditAllocated) => row.Extra
  },
  {
    name: 'CreatedAt',
    label: t('MSG_CREATED_AT'),
    sortable: true,
    field: (row: inspirecreditallocated.CreditAllocated) => utils.formatTime(row.CreatedAt)
  }
])
</script>
