<template>
  <q-table
    dense
    flat
    :title='$t("MSG_COINS")'
    :rows='displayCoins'
    row-key='ID'
    :loading='coinLoading'
    :rows-per-page-options='[10]'
  />
  <q-table
    dense
    flat
    :title='$t("MSG_WITHDRAW_ADDRESS_REVIEWS")'
    :rows='displayReviews'
    row-key='ID'
    :loading='reviewLoading'
    :rows-per-page-options='[20]'
    @row-click='(evt, row, index) => onRowClick(row as Review)'
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
        <q-item-label>{{ $t('MSG_EMAIL_ADDRESS') }}: {{ target.User.User.EmailAddress }}</q-item-label>
        <q-item-label>{{ $t('MSG_PHONE_NO') }}: {{ target.User.User.PhoneNO }}</q-item-label>
        <q-item-label>{{ $t('MSG_USERNAME') }}: {{ target.User.Extra?.Username }}</q-item-label>
        <q-item-label>{{ $t('MSG_FIRST_NAME') }}: {{ target.User.Extra?.FirstName }}</q-item-label>
        <q-item-label>{{ $t('MSG_LAST_NAME') }}: {{ target.User.Extra?.LastName }}</q-item-label>
        <q-item-label>{{ $t('MSG_GENDER') }}: {{ target.User.Extra?.Gender }}</q-item-label>
      </q-card-section>
      <q-card-section>
        <q-item-label>{{ $t('MSG_COIN_TYPE') }}: {{ coin?.Name }}</q-item-label>
        <q-item-label>{{ $t('MSG_ADDRESS_NAME') }}: {{ target.Address.Name }}</q-item-label>
        <q-item-label>{{ $t('MSG_ADDRESS_MESSAGE') }}: {{ target.Address.Message }}</q-item-label>
        <q-item-label>{{ $t('MSG_ADDRESS_LABELS') }}: {{ target.Address.Labels }}</q-item-label>
        <q-item-label>{{ $t('MSG_CREATE_AT') }}: {{ formatTime(target.Address.CreateAt) }}</q-item-label>
        <q-item-label>{{ $t('MSG_ADDRESS') }}: {{ target.Account.Address }}</q-item-label>
      </q-card-section>
      <q-card-section>
        <q-input v-model='target.Review.Message' :label='$t("MSG_COMMENT")' />
      </q-card-section>
      <q-item class='row'>
        <q-btn class='btn round alt' :label='$t("MSG_APPROVE")' @click='onApprove' />
        <q-btn class='btn round alt' :label='$t("MSG_REJECT")' @click='onReject' />
        <q-btn class='btn round' :label='$t("MSG_CANCEL")' @click='onCancel' />
      </q-item>
    </q-card>
  </q-dialog>
</template>

<script setup lang='ts'>
import {
  NotificationType,
  useReviewStore,
  ReviewState,
  WithdrawAddressReview,
  useCoinStore,
  formatTime,
  useLoginedUserStore,
  useChurchReviewStore,
  Review
} from 'npool-cli-v2'
import { useLocalApplicationStore } from 'src/localstore'
import { computed, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const app = useLocalApplicationStore()
const appID = computed(() => app.AppID)

const review = useChurchReviewStore()
const areview = useReviewStore()
const coins = useCoinStore()
const logined = useLoginedUserStore()

const reviews = computed(() => review.WithdrawAddressReviews.get(appID.value))
const displayReviews = computed(() => Array.from(reviews.value ? reviews.value : []).map((el) => el.Review))
const reviewLoading = ref(true)

const displayCoins = computed(() => coins.Coins)
const coinLoading = ref(true)

const prepare = () => {
  review.getWithdrawAddressReviews({
    TargetAppID: appID.value,
    Message: {
      Error: {
        Title: t('MSG_GET_WITHDRAW_ADDRESS_REVIEWS'),
        Message: t('MSG_GET_WITHDRAW_ADDRESS_REVIEWS_FAIL'),
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, () => {
    reviewLoading.value = false
  })
}

watch(appID, () => {
  prepare()
})

onMounted(() => {
  prepare()

  coins.getCoins({
    Message: {
      Error: {
        Title: t('MSG_GET_WITHDRAW_ADDRESS_REVIEWS'),
        Message: t('MSG_GET_WITHDRAW_ADDRESS_REVIEWS_FAIL'),
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, () => {
    coinLoading.value = false
  })
})

const showing = ref(false)
const target = ref({} as unknown as WithdrawAddressReview)
const coin = computed(() => coins.getCoinByID(target.value.Address?.CoinTypeID))

const onMenuHide = () => {
  target.value = {} as unknown as WithdrawAddressReview
}

const onRowClick = (review: Review) => {
  const index = reviews.value?.findIndex((el) => el.Review.ID === review.ID)
  if (index !== undefined && index >= 0) {
    target.value = reviews.value ? reviews.value[index] : {} as unknown as WithdrawAddressReview
  }
  showing.value = true
}

const updateReview = () => {
  target.value.Review.ReviewerID = logined.LoginedUser?.User?.ID

  areview.updateReview({
    Info: target.value.Review,
    Message: {
      Error: {
        Title: t('MSG_UPDATE_WITHDRAW_ADDRESS_REVIEW'),
        Message: t('MSG_UPDATE_WITHDRAW_ADDRESS_REVIEW_FAIL'),
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, () => {
    // TODO
  })
}

const onApprove = () => {
  showing.value = false
  target.value.Review.State = ReviewState.Approved
  updateReview()
  onMenuHide()
}

const onReject = () => {
  showing.value = false
  target.value.Review.State = ReviewState.Rejected
  updateReview()
  onMenuHide()
}

const onCancel = () => {
  showing.value = false
  onMenuHide()
}

</script>
