<template>
  <q-table
    dense
    flat
    :title='$t("MSG_KYC_REVIEWS")'
    :rows='displayReviews'
    row-key='ID'
    :loading='reviewLoading'
    :rows-per-page-options='[100]'
    @row-click='(evt, row, index) => onRowClick(row)'
  />
  <q-dialog
    v-model='showing'
    @hide='onMenuHide'
    position='right'
  >
    <q-card class='popup-menu'>
      <q-card-section>
        <span>{{ $t('MSG_REVIEW_KYC') }}</span>
      </q-card-section>
      <q-card-section>
        <q-item-label>{{ $t('MSG_EMAIL_ADDRESS') }}: {{ target?.EmailAddress }}</q-item-label>
        <q-item-label>{{ $t('MSG_PHONE_NO') }}: {{ target?.PhoneNO }}</q-item-label>
        <q-item-label>{{ $t('MSG_USERNAME') }}: {{ targetUser?.Username }}</q-item-label>
        <q-item-label>{{ $t('MSG_FIRST_NAME') }}: {{ targetUser?.FirstName }}</q-item-label>
        <q-item-label>{{ $t('MSG_LAST_NAME') }}: {{ targetUser?.LastName }}</q-item-label>
        <q-item-label>{{ $t('MSG_GENDER') }}: {{ $t(targetUser?.Gender) }}</q-item-label>
      </q-card-section>
      <q-item class='row'>
        <q-item-label>{{ $t('MSG_CARD_TYPE') }}: {{ target.DocumentType }}</q-item-label>
      </q-item>
      <q-item class='row'>
        <q-item-label>{{ $t('MSG_KYC_REVIEW_STATE') }}: {{ target?.ReviewState }}</q-item-label>
      </q-item>
      <q-item class='row'>
        <q-item-section>
          <q-img :ratio='1' :src='(images?.get(kyc.ImageType.FrontImg)?.Base64 as string)' />
        </q-item-section>
        <q-item-section v-if='target?.DocumentType === kyc.DocumentType.IDCard'>
          <q-img :ratio='1' :src='(images?.get(kyc.ImageType.BackImg)?.Base64 as string)' />
        </q-item-section>
        <q-item-section>
          <q-img :ratio='1' :src='(images?.get(kyc.ImageType.SelfieImg)?.Base64 as string)' />
        </q-item-section>
      </q-item>
      <q-card-section>
        <q-input v-model='target.Message' :label='$t("MSG_COMMENT")' />
      </q-card-section>
      <q-item class='row'>
        <q-btn class='btn round alt' :label='$t("MSG_APPROVE")' @click='updateReview(reviewbase.ReviewState.Approved)' :disable='disableUpdateBtn(target)' />
        <q-btn class='btn round alt' :label='$t("MSG_REJECT")' @click='updateReview(reviewbase.ReviewState.Rejected)' :disable='disableUpdateBtn(target)' />
        <q-btn class='btn round' :label='$t("MSG_CANCEL")' @click='onCancel' />
      </q-item>
    </q-card>
  </q-dialog>
</template>

<script setup lang='ts'>
import { computed, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { kycreview, kyc, notify, reviewbase, user, sdk } from 'src/npoolstore'

const AppID = sdk.AppID

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const disableUpdateBtn = computed(() => (review: kycreview.KYCReview) => {
  return review.ReviewState === reviewbase.ReviewState.Approved || review.ReviewState === reviewbase.ReviewState.Rejected
})
const _kyc = kyc.useKYCStore()
const review = kycreview.useKycReviewStore()

const displayReviews = computed(() => review.reviews(AppID.value))
const reviewLoading = ref(false)

const getAppKycReviews = (offset: number, limit: number) => {
  review.getAppKycReviews({
    TargetAppID: AppID.value,
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: t('MSG_GET_KYC_REVIEWS'),
        Message: t('MSG_GET_KYC_REVIEWS_FAIL'),
        Popup: true,
        Type: notify.NotifyType.Error
      }
    }
  }, (error: boolean, reviews?: Array<kycreview.KYCReview>) => {
    if (error || !reviews?.length) {
      reviewLoading.value = false
      return
    }
    getAppKycReviews(offset + limit, limit)
  })
}
const prepare = () => {
  if (!review.reviews().length) {
    reviewLoading.value = true
    getAppKycReviews(0, 100)
  }
  if (!_user.appUsers(AppID.value).length) {
    reviewLoading.value = true
    getAppUsers(0, 100)
  }
}

watch(AppID, () => {
  prepare()
})

const _user = user.useUserStore()
onMounted(() => {
  prepare()
})

const showing = ref(false)
const target = ref({} as kycreview.KYCReview)
const targetUser = ref({} as user.User)
const images = computed(() => _kyc.images(AppID.value, target.value.UserID))

const onMenuHide = () => {
  showing.value = false
  target.value = {} as unknown as kycreview.KYCReview
  targetUser.value = {} as unknown as user.User
}

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
      reviewLoading.value = false
      return
    }
    getAppUsers(offset + limit, limit)
  })
}

const onRowClick = (row: kycreview.KYCReview) => {
  target.value = { ...row }
  if (!_user.appUser(AppID.value, row.UserID)) {
    return
  }
  targetUser.value = { ..._user.appUser(AppID.value, row.UserID) as user.User }
  showing.value = true
  _kyc.getAppUserKYCImage({
    TargetAppID: AppID.value,
    TargetUserID: row.UserID,
    ImageType: kyc.ImageType.FrontImg,
    Message: {
      Error: {
        Title: t('MSG_GET_KYC_IMAGES'),
        Message: t('MSG_GET_KYC_IMAGES_FAIL'),
        Popup: true,
        Type: notify.NotifyType.Error
      }
    }
  }, target.value.KycID, () => {
    _kyc.getAppUserKYCImage({
      TargetAppID: AppID.value,
      TargetUserID: row.UserID,
      ImageType: kyc.ImageType.SelfieImg,
      Message: {
        Error: {
          Title: t('MSG_GET_KYC_IMAGES'),
          Message: t('MSG_GET_KYC_IMAGES_FAIL'),
          Popup: true,
          Type: notify.NotifyType.Error
        }
      }
    }, target.value.KycID, () => {
      if (target?.value?.DocumentType === kyc.DocumentType.Passport) {
        showing.value = true
        return
      }
      _kyc.getAppUserKYCImage({
        TargetAppID: AppID.value,
        TargetUserID: row.UserID,
        ImageType: kyc.ImageType.BackImg,
        Message: {
          Error: {
            Title: t('MSG_GET_KYC_IMAGES'),
            Message: t('MSG_GET_KYC_IMAGES_FAIL'),
            Popup: true,
            Type: notify.NotifyType.Error
          }
        }
      }, target.value.KycID, () => {
        showing.value = true
      })
    })
  })
}

const updateReview = (state: reviewbase.ReviewState) => {
  if (state === reviewbase.ReviewState.Rejected && target.value.Message.length === 0) {
    console.log('message is required')
    return
  }

  review.updateAppKycReview({
    TargetAppID: AppID.value,
    ReviewID: target.value?.ReviewID,
    State: state,
    Message: target.value.Message,
    NotifyMessage: {
      Error: {
        Title: t('MSG_UPDATE_KYC_REVIEW'),
        Message: t('MSG_UPDATE_KYC_REVIEW_FAIL'),
        Popup: true,
        Type: notify.NotifyType.Error
      }
    }
  }, (error: boolean) => {
    if (error) {
      return
    }
    target.value.ReviewState = state
    onMenuHide()
  })
}
const onCancel = () => {
  onMenuHide()
}

</script>
