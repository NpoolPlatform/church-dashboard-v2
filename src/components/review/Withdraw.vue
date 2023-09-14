<template>
  <q-table
    dense
    flat
    :title='$t("MSG_WITHDRAW_REVIEWS")'
    :rows='displayReviews'
    row-key='ID'
    :columns='columns'
    :rows-per-page-options='[100]'
    @row-click='(evt, row, index) => onRowClick(row as WithdrawReview)'
  />
  <q-dialog
    v-model='showing'
    @hide='onMenuHide'
    position='right'
  >
    <q-card class='popup-menu'>
      <q-card-section>
        <span>{{ $t('MSG_REVIEW_WITHDRAW_ADDRESSES') }}</span>
      </q-card-section>
      <q-card-section>
        <q-item-label>{{ $t('MSG_EMAIL_ADDRESS') }}: {{ target?.EmailAddress }}</q-item-label>
        <q-item-label>{{ $t('MSG_PHONE_NO') }}: {{ target?.PhoneNO }}</q-item-label>
      </q-card-section>
      <q-card-section>
        <q-item-label>{{ $t('MSG_COIN_TYPE') }}: {{ coin?.getCoinByID(AppID, target.CoinTypeID)?.Name }}</q-item-label>
        <q-item-label>{{ $t('MSG_AMOUNT') }}: {{ target?.Amount }}</q-item-label>
        <q-item-label>{{ $t('MSG_MESSAGE') }}: {{ target?.Trigger }}</q-item-label>
        <q-item-label>{{ $t('MSG_MESSAGE') }}: {{ target?.State }}</q-item-label>
      </q-card-section>
      <q-card-section>
        <q-input v-model='target.Message' :label='$t("MSG_COMMENT")' />
      </q-card-section>
      <q-item class='row'>
        <LoadingButton :loading='true' :label='$t("MSG_APPROVE")' @click='onApprove' :disabled='target.State === ReviewState.Rejected' />
        <LoadingButton :loading='true' :label='$t("MSG_REJECT")' @click='onReject' :disabled='target.State === ReviewState.Rejected' />
        <q-btn class='btn round' :label='$t("MSG_CANCEL")' @click='onCancel' />
      </q-item>
    </q-card>
  </q-dialog>
</template>

<script setup lang='ts'>
import {
  useLocaleStore,
  NotifyType,
  useChurchWithdrawReviewStore,
  useLocalUserStore,
  WithdrawReview,
  ReviewState,
  useChurchAppCoinStore,
  formatTime
} from 'npool-cli-v4'
import { getAppCoins } from 'src/api/coin'
import { AppID } from 'src/api/app'
import { computed, onMounted, ref, watch, defineAsyncComponent } from 'vue'
import { useI18n } from 'vue-i18n'

const LoadingButton = defineAsyncComponent(() => import('src/components/button/LoadingButton.vue'))

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const coin = useChurchAppCoinStore()
const coins = computed(() => coin.getCoinsByAppID(AppID.value))

const review = useChurchWithdrawReviewStore()
const locale = useLocaleStore()
const logined = useLocalUserStore()

const displayReviews = computed(() => {
  return review.WithdrawReviews.WithdrawReviews.get(AppID.value) ? review.WithdrawReviews.WithdrawReviews.get(AppID.value) : []
})

const showing = ref(false)
const target = ref({} as WithdrawReview)

const onMenuHide = () => {
  target.value = {} as WithdrawReview
  showing.value = false
}

const onRowClick = (withdrawReview: WithdrawReview) => {
  target.value = { ...withdrawReview }
  showing.value = true
}

const onApprove = (done: () => void) => {
  target.value.State = ReviewState.Approved
  updateAppWithdrawReview(done)
}

const onReject = (done: () => void) => {
  if (target.value.Message.trim().length <= 0) {
    console.log('need message')
    done()
    return
  }
  target.value.State = ReviewState.Rejected
  updateAppWithdrawReview(done)
}

const onCancel = () => {
  showing.value = false
  onMenuHide()
}

const getAppWithdrawReviews = (offset: number, limit: number) => {
  review.getAppWithdrawReviews({
    Offset: offset,
    Limit: limit,
    TargetAppID: AppID.value,
    Message: {
      Error: {
        Title: t('MSG_GET_WITHDRAW_REVIEWS'),
        Message: t('MSG_GET_WITHDRAW_REVIEWS_FAIL'),
        Popup: true,
        Type: NotifyType.Error
      }
    }
  }, (reviews: Array<WithdrawReview>, error: boolean) => {
    if (error || reviews.length === 0) {
      return
    }
    getAppWithdrawReviews(offset + limit, limit)
  })
}

const updateAppWithdrawReview = (done: () => void) => {
  review.updateAppWithdrawReview({
    TargetAppID: AppID.value,
    AppID: undefined as unknown as string,
    ReviewID: target.value.ReviewID,
    LangID: locale.AppLang?.LangID,
    UserID: logined.User?.ID,
    Message: target.value.Message,
    State: target.value.State,
    NotifyMessage: {
      Error: {
        Title: t('MSG_UPDATE_WITHDRAW_REVIEW'),
        Message: t('MSG_UPDATE_WITHDRAW_REVIEW_FAIL'),
        Popup: true,
        Type: NotifyType.Error
      }
    }
  }, (review: WithdrawReview, error: boolean) => {
    done()
    if (error) {
      return
    }
    onMenuHide()
  })
}

onMounted(() => {
  prepare()
})

watch(AppID, () => {
  prepare()
})

const prepare = () => {
  if (!review.WithdrawReviews.WithdrawReviews.get(AppID.value)) {
    getAppWithdrawReviews(0, 500)
  }

  if (coins.value.length === 0) {
    getAppCoins(0, 500)
  }
}

const columns = computed(() => [
  {
    name: 'CoinName',
    label: t('MSG_COIN_NAME'),
    sortable: true,
    field: (row: WithdrawReview) => row.CoinName
  },
  {
    name: 'CoinLogo',
    label: t('MSG_COIN_LOGO'),
    sortable: true,
    field: (row: WithdrawReview) => row.CoinLogo
  },
  {
    name: 'CoinTypeID',
    label: t('MSG_COIN_TYPE_ID'),
    sortable: true,
    field: (row: WithdrawReview) => row.CoinTypeID
  },
  {
    name: 'Amount',
    label: t('MSG_AMOUNT'),
    sortable: true,
    field: (row: WithdrawReview) => row.Amount
  },
  {
    name: 'Address',
    label: t('MSG_ADDRESS'),
    sortable: true,
    field: (row: WithdrawReview) => row.Address
  },
  {
    name: 'WithdrawState',
    label: t('MSG_WITHDRAW_STATE'),
    sortable: true,
    field: (row: WithdrawReview) => row.WithdrawState
  },
  {
    name: 'State',
    label: t('MSG_STATE'),
    sortable: true,
    field: (row: WithdrawReview) => row.State
  },
  {
    name: 'Trigger',
    label: t('MSG_TRIGGER'),
    sortable: true,
    field: (row: WithdrawReview) => row.Trigger
  },
  {
    name: 'Message',
    label: t('MSG_MESSAGE'),
    sortable: true,
    field: (row: WithdrawReview) => row.Message
  },
  {
    name: 'CreatedAt',
    label: t('MSG_CREATED_AT'),
    sortable: true,
    field: (row: WithdrawReview) => formatTime(row.CreatedAt)
  },
  {
    name: 'UpdatedAt',
    label: t('MSG_UPDATED_AT'),
    sortable: true,
    field: (row: WithdrawReview) => formatTime(row.UpdatedAt)
  },
  {
    name: 'UserID',
    label: t('MSG_USER_ID'),
    sortable: true,
    field: (row: WithdrawReview) => row.UserID
  },
  {
    name: 'EmailAddress',
    label: t('MSG_EMAIL_ADDRESS'),
    sortable: true,
    field: (row: WithdrawReview) => row.EmailAddress
  },
  {
    name: 'PhoneNO',
    label: t('MSG_PHONE_NO'),
    sortable: true,
    field: (row: WithdrawReview) => row.PhoneNO
  },
  {
    name: 'KycState',
    label: t('MSG_KYC_STATE'),
    sortable: true,
    field: (row: WithdrawReview) => row.KycState
  }
])
</script>
