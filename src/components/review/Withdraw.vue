<template>
  <q-table
    dense
    flat
    :title='$t("MSG_WITHDRAW_REVIEWS")'
    :rows='displayReviews'
    row-key='ID'
    :columns='columns'
    :rows-per-page-options='[100]'
    @row-click='(evt, row, index) => onRowClick(row as withdrawreview.WithdrawReview)'
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
        <q-item-label>{{ $t('MSG_COIN_TYPE') }}: {{ coin?.coin(AppID, target.CoinTypeID)?.Name }}</q-item-label>
        <q-item-label>{{ $t('MSG_AMOUNT') }}: {{ target?.Amount }}</q-item-label>
        <q-item-label>{{ $t('MSG_MESSAGE') }}: {{ target?.Trigger }}</q-item-label>
        <q-item-label>{{ $t('MSG_MESSAGE') }}: {{ target?.State }}</q-item-label>
      </q-card-section>
      <q-card-section>
        <q-input v-model='target.Message' :label='$t("MSG_COMMENT")' />
      </q-card-section>
      <q-item class='row'>
        <LoadingButton :loading='true' :label='$t("MSG_APPROVE")' @click='onApprove' :disabled='target.State === reviewbase.ReviewState.Rejected' />
        <LoadingButton :loading='true' :label='$t("MSG_REJECT")' @click='onReject' :disabled='target.State === reviewbase.ReviewState.Rejected' />
        <q-btn class='btn round' :label='$t("MSG_CANCEL")' @click='onCancel' />
      </q-item>
    </q-card>
  </q-dialog>
</template>

<script setup lang='ts'>
import { getAppCoins } from 'src/api/coin'
import { AppID } from 'src/api/app'
import { computed, onMounted, ref, watch, defineAsyncComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import { appcoin, _locale, withdrawreview, user, reviewbase, notify, utils } from 'src/npoolstore'

const LoadingButton = defineAsyncComponent(() => import('src/components/button/LoadingButton.vue'))

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const coin = appcoin.useAppCoinStore()
const coins = computed(() => coin.coins(AppID.value))

const review = withdrawreview.useWithdrawReviewStore()
const locale = _locale.useLocaleStore()
const logined = user.useLocalUserStore()

const displayReviews = computed(() => {
  return review.reviews(AppID.value)
})

const showing = ref(false)
const target = ref({} as withdrawreview.WithdrawReview)

const onMenuHide = () => {
  target.value = {} as withdrawreview.WithdrawReview
  showing.value = false
}

const onRowClick = (withdrawReview: withdrawreview.WithdrawReview) => {
  target.value = { ...withdrawReview }
  showing.value = true
}

const onApprove = (done: () => void) => {
  target.value.State = reviewbase.ReviewState.Approved
  updateAppWithdrawReview(done)
}

const onReject = (done: () => void) => {
  if (target.value.Message.trim().length <= 0) {
    console.log('need message')
    done()
    return
  }
  target.value.State = reviewbase.ReviewState.Rejected
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
        Type: notify.NotifyType.Error
      }
    }
  }, (error: boolean, reviews?: Array<withdrawreview.WithdrawReview>) => {
    if (error || !reviews?.length) {
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
        Type: notify.NotifyType.Error
      }
    }
  }, (error: boolean) => {
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
  if (!review.reviews(AppID.value).length) {
    getAppWithdrawReviews(0, 100)
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
    field: (row: withdrawreview.WithdrawReview) => row.CoinName
  },
  {
    name: 'CoinLogo',
    label: t('MSG_COIN_LOGO'),
    sortable: true,
    field: (row: withdrawreview.WithdrawReview) => row.CoinLogo
  },
  {
    name: 'CoinTypeID',
    label: t('MSG_COIN_TYPE_ID'),
    sortable: true,
    field: (row: withdrawreview.WithdrawReview) => row.CoinTypeID
  },
  {
    name: 'Amount',
    label: t('MSG_AMOUNT'),
    sortable: true,
    field: (row: withdrawreview.WithdrawReview) => row.Amount
  },
  {
    name: 'Address',
    label: t('MSG_ADDRESS'),
    sortable: true,
    field: (row: withdrawreview.WithdrawReview) => row.Address
  },
  {
    name: 'WithdrawState',
    label: t('MSG_WITHDRAW_STATE'),
    sortable: true,
    field: (row: withdrawreview.WithdrawReview) => row.WithdrawState
  },
  {
    name: 'State',
    label: t('MSG_STATE'),
    sortable: true,
    field: (row: withdrawreview.WithdrawReview) => row.State
  },
  {
    name: 'Trigger',
    label: t('MSG_TRIGGER'),
    sortable: true,
    field: (row: withdrawreview.WithdrawReview) => row.Trigger
  },
  {
    name: 'Message',
    label: t('MSG_MESSAGE'),
    sortable: true,
    field: (row: withdrawreview.WithdrawReview) => row.Message
  },
  {
    name: 'CreatedAt',
    label: t('MSG_CREATED_AT'),
    sortable: true,
    field: (row: withdrawreview.WithdrawReview) => utils.formatTime(row.CreatedAt)
  },
  {
    name: 'UpdatedAt',
    label: t('MSG_UPDATED_AT'),
    sortable: true,
    field: (row: withdrawreview.WithdrawReview) => utils.formatTime(row.UpdatedAt)
  },
  {
    name: 'UserID',
    label: t('MSG_USER_ID'),
    sortable: true,
    field: (row: withdrawreview.WithdrawReview) => row.UserID
  },
  {
    name: 'EmailAddress',
    label: t('MSG_EMAIL_ADDRESS'),
    sortable: true,
    field: (row: withdrawreview.WithdrawReview) => row.EmailAddress
  },
  {
    name: 'PhoneNO',
    label: t('MSG_PHONE_NO'),
    sortable: true,
    field: (row: withdrawreview.WithdrawReview) => row.PhoneNO
  },
  {
    name: 'KycState',
    label: t('MSG_KYC_STATE'),
    sortable: true,
    field: (row: withdrawreview.WithdrawReview) => row.KycState
  }
])
</script>
