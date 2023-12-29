<template>
  <q-table
    dense
    flat
    :title='$t("MSG_COUPON_WITHDRAW_REVIEWS")'
    :rows='displayReviews'
    row-key='ID'
    :columns='columns'
    :rows-per-page-options='[100]'
    @row-click='(evt, row, index) => onRowClick(row as couponwithdrawreview.CouponWithdrawReview)'
  />
  <q-dialog
    v-model='showing'
    @hide='onMenuHide'
    position='right'
  >
    <q-card class='popup-menu'>
      <q-card-section>
        <span>{{ $t('MSG_REVIEW_COUPON_WITHDRAW') }}</span>
      </q-card-section>
      <q-card-section>
        <q-item-label>{{ $t('MSG_EMAIL_ADDRESS') }}: {{ target?.EmailAddress }}</q-item-label>
        <q-item-label>{{ $t('MSG_PHONE_NO') }}: {{ target?.PhoneNO }}</q-item-label>
      </q-card-section>
      <q-card-section>
        <q-item-label>{{ $t('MSG_COUPON_NAME') }}: {{ target?.CouponName }}</q-item-label>
      </q-card-section>
      <q-card-section>
        <q-item-label>{{ $t('MSG_COIN_TYPE_ID') }}: {{ target?.CoinTypeID }}</q-item-label>
        <q-item-label>{{ $t('MSG_COIN_NAME') }}: {{ target?.CoinName }}</q-item-label>
        <q-item-label>{{ $t('MSG_AMOUNT') }}: {{ target?.Amount }}</q-item-label>
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
import { AppID } from 'src/api/app'
import { computed, onMounted, ref, watch, defineAsyncComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import { couponwithdrawreview, user, reviewbase, notify, utils } from 'src/npoolstore'
const LoadingButton = defineAsyncComponent(() => import('src/components/button/LoadingButton.vue'))
// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const review = couponwithdrawreview.useCouponWithdrawReviewStore()
const logined = user.useLocalUserStore()

const displayReviews = computed(() => {
  return review.reviews(AppID.value)
})

const showing = ref(false)
const target = ref({} as couponwithdrawreview.CouponWithdrawReview)

const onMenuHide = () => {
  target.value = {} as couponwithdrawreview.CouponWithdrawReview
  showing.value = false
}

const onRowClick = (withdrawReview: couponwithdrawreview.CouponWithdrawReview) => {
  target.value = { ...withdrawReview }
  showing.value = true
}

const onApprove = (done: () => void) => {
  target.value.State = reviewbase.ReviewState.Approved
  updateAppCouponWithdrawReview(done)
}

const onReject = (done: () => void) => {
  if (target.value.Message.trim().length <= 0) {
    console.log('need message')
    done()
    return
  }
  target.value.State = reviewbase.ReviewState.Rejected
  updateAppCouponWithdrawReview(done)
}

const onCancel = () => {
  showing.value = false
  onMenuHide()
}

const getAppCouponWithdrawReviews = (offset: number, limit: number) => {
  review.getAppCouponWithdrawReviews({
    Offset: offset,
    Limit: limit,
    TargetAppID: AppID.value,
    Message: {
      Error: {
        Title: t('MSG_GET_COUPON_WITHDRAW_REVIEWS'),
        Message: t('MSG_GET_COUPON_WITHDRAW_REVIEWS_FAIL'),
        Popup: true,
        Type: notify.NotifyType.Error
      }
    }
  }, (error: boolean, reviews?: Array<couponwithdrawreview.CouponWithdrawReview>) => {
    if (error || !reviews?.length) {
      return
    }
    getAppCouponWithdrawReviews(offset + limit, limit)
  })
}

const updateAppCouponWithdrawReview = (done: () => void) => {
  review.updateAppCouponWithdrawReview({
    ID: target.value.ID,
    EntID: target.value.EntID,
    TargetAppID: AppID.value,
    AppID: undefined as unknown as string,
    UserID: logined.User?.EntID,
    Message: target.value.Message,
    State: target.value.State,
    NotifyMessage: {
      Error: {
        Title: t('MSG_UPDATE_COUPON_WITHDRAW_REVIEW'),
        Message: t('MSG_UPDATE_COUPON_WITHDRAW_REVIEW_FAIL'),
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
    getAppCouponWithdrawReviews(0, 100)
  }
}

const columns = computed(() => [
  {
    name: 'ID',
    label: t('MSG_ID'),
    sortable: true,
    field: (row: couponwithdrawreview.CouponWithdrawReview) => row.ID
  },
  {
    name: 'EntID',
    label: t('MSG_ENT_ID'),
    sortable: true,
    field: (row: couponwithdrawreview.CouponWithdrawReview) => row.EntID
  },
  {
    name: 'UserID',
    label: t('MSG_USER_ID'),
    sortable: true,
    field: (row: couponwithdrawreview.CouponWithdrawReview) => row.UserID
  },
  {
    name: 'EmailAddress',
    label: t('MSG_EMAIL_ADDRESS'),
    sortable: true,
    field: (row: couponwithdrawreview.CouponWithdrawReview) => row.EmailAddress
  },
  {
    name: 'PhoneNO',
    label: t('MSG_PHONE_NO'),
    sortable: true,
    field: (row: couponwithdrawreview.CouponWithdrawReview) => row.PhoneNO
  },
  {
    name: 'Reviewer',
    label: t('MSG_REVIEWER'),
    sortable: true,
    field: (row: couponwithdrawreview.CouponWithdrawReview) => row.Reviewer
  },
  {
    name: 'AllocatedID',
    label: t('MSG_ALLOCATED_ID'),
    sortable: true,
    field: (row: couponwithdrawreview.CouponWithdrawReview) => row.AllocatedID
  },
  {
    name: 'CoinName',
    label: t('MSG_COUPON_NAME'),
    sortable: true,
    field: (row: couponwithdrawreview.CouponWithdrawReview) => row.CoinName
  },
  {
    name: 'CoinName',
    label: t('MSG_COIN_NAME'),
    sortable: true,
    field: (row: couponwithdrawreview.CouponWithdrawReview) => row.CoinName
  },
  {
    name: 'CoinLogo',
    label: t('MSG_COIN_LOGO'),
    sortable: true,
    field: (row: couponwithdrawreview.CouponWithdrawReview) => row.CoinLogo
  },
  {
    name: 'CoinTypeID',
    label: t('MSG_COIN_TYPE_ID'),
    sortable: true,
    field: (row: couponwithdrawreview.CouponWithdrawReview) => row.CoinTypeID
  },
  {
    name: 'Amount',
    label: t('MSG_AMOUNT'),
    sortable: true,
    field: (row: couponwithdrawreview.CouponWithdrawReview) => row.Amount
  },
  {
    name: 'State',
    label: t('MSG_STATE'),
    sortable: true,
    field: (row: couponwithdrawreview.CouponWithdrawReview) => row.State
  },
  {
    name: 'State',
    label: t('MSG_STATE'),
    sortable: true,
    field: (row: couponwithdrawreview.CouponWithdrawReview) => row.State
  },
  {
    name: 'Trigger',
    label: t('MSG_TRIGGER'),
    sortable: true,
    field: (row: couponwithdrawreview.CouponWithdrawReview) => row.Trigger
  },
  {
    name: 'Message',
    label: t('MSG_MESSAGE'),
    sortable: true,
    field: (row: couponwithdrawreview.CouponWithdrawReview) => row.Message
  },
  {
    name: 'CreatedAt',
    label: t('MSG_CREATED_AT'),
    sortable: true,
    field: (row: couponwithdrawreview.CouponWithdrawReview) => utils.formatTime(row.CreatedAt)
  },
  {
    name: 'UpdatedAt',
    label: t('MSG_UPDATED_AT'),
    sortable: true,
    field: (row: couponwithdrawreview.CouponWithdrawReview) => utils.formatTime(row.UpdatedAt)
  }
])
</script>
