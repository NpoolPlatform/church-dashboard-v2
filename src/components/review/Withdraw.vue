<template>
  <q-table
    dense
    flat
    :title='$t("MSG_WITHDRAW_REVIEWS")'
    :rows='displayReviews'
    row-key='ID'
    :rows-per-page-options='[20]'
    @row-click='(evt, row, index) => onRowClick(row as WithdrawReview)'
  />
  <q-card>
    <q-card-section class='bg-primary text-white'>
      {{ $t('MSG_ADVERTISEMENT_POSITION') }}
    </q-card-section>
  </q-card>
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
        <q-item-label>{{ $t('MSG_COIN_TYPE') }}: {{ coin?.getCoinByID(appID, target.CoinTypeID)?.Name }}</q-item-label>
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
  useLocaleStore
} from 'npool-cli-v2'
import { NotifyType, useChurchWithdrawReviewStore, useLocalUserStore, WithdrawReview, ReviewState, useChurchAppCoinStore } from 'npool-cli-v4'
import { getAppCoins } from 'src/api/coin'
import { useLocalApplicationStore } from 'src/localstore'
import { computed, onMounted, ref, watch, defineAsyncComponent } from 'vue'
import { useI18n } from 'vue-i18n'

const LoadingButton = defineAsyncComponent(() => import('src/components/button/LoadingButton.vue'))

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const app = useLocalApplicationStore()
const appID = computed(() => app.AppID)

const coin = useChurchAppCoinStore()
const coins = computed(() => coin.getCoinsByAppID(appID.value))

const review = useChurchWithdrawReviewStore()
const locale = useLocaleStore()
const logined = useLocalUserStore()

const displayReviews = computed(() => {
  return review.WithdrawReviews.WithdrawReviews.get(appID.value) ? review.WithdrawReviews.WithdrawReviews.get(appID.value) : []
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
    TargetAppID: appID.value,
    Message: {
      Error: {
        Title: t('MSG_GET_WITHDRAW_REVIEWS'),
        Message: t('MSG_GET_WITHDRAW_REVIEWS_FAIL'),
        Popup: true,
        Type: NotifyType.Error
      }
    }
  }, (reviews: Array<WithdrawReview>, error: boolean) => {
    if (error || reviews.length < limit) {
      return
    }
    getAppWithdrawReviews(offset + limit, limit)
  })
}

const updateAppWithdrawReview = (done: () => void) => {
  review.updateAppWithdrawReview({
    TargetAppID: appID.value,
    AppID: appID.value,
    ReviewID: target.value.ReviewID,
    LangID: locale.CurLang?.ID as string,
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

watch(appID, () => {
  prepare()
})

const prepare = () => {
  if (!review.WithdrawReviews.WithdrawReviews.get(appID.value)) {
    getAppWithdrawReviews(0, 500)
  }

  if (coins.value.length === 0) {
    getAppCoins(0, 500)
  }
}
</script>
