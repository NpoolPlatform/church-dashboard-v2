<template>
  <q-table
    dense
    flat
    :title='$t("MSG_KYC_REVIEWS")'
    :rows='displayReviews'
    row-key='ID'
    :loading='reviewLoading'
    ::rows-per-page-options='[100]'
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
          <q-img :ratio='1' :src='(images?.get(ImageType.FrontImg)?.Base64 as string)' />
        </q-item-section>
        <q-item-section v-if='target?.DocumentType === DocumentType.IDCard'>
          <q-img :ratio='1' :src='(images?.get(ImageType.BackImg)?.Base64 as string)' />
        </q-item-section>
        <q-item-section>
          <q-img :ratio='1' :src='(images?.get(ImageType.SelfieImg)?.Base64 as string)' />
        </q-item-section>
      </q-item>
      <q-card-section>
        <q-input v-model='target.Message' :label='$t("MSG_COMMENT")' />
      </q-card-section>
      <q-item class='row'>
        <q-btn class='btn round alt' :label='$t("MSG_APPROVE")' @click='updateReview(KYCReviewState.Approved)' :disable='disableUpdateBtn(target)' />
        <q-btn class='btn round alt' :label='$t("MSG_REJECT")' @click='updateReview(KYCReviewState.Rejected)' :disable='disableUpdateBtn(target)' />
        <q-btn class='btn round' :label='$t("MSG_CANCEL")' @click='onCancel' />
      </q-item>
    </q-card>
  </q-dialog>
</template>

<script setup lang='ts'>
import { NotifyType, KYCReview, KYCReviewState, ImageType, DocumentType, useChurchKycStore, User, useChurchUserStore, useLocaleStore } from 'npool-cli-v4'
import { useLocalApplicationStore } from 'src/localstore'
import { computed, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const app = useLocalApplicationStore()
const appID = computed(() => app.AppID)

const disableUpdateBtn = computed(() => (review: KYCReview) => review.ReviewState === KYCReviewState.Approved || review.ReviewState === KYCReviewState.Rejected)
const kyc = useChurchKycStore()
const locale = useLocaleStore()

const displayReviews = computed(() => !kyc.KycReviews.KycReviews.get(appID.value) ? [] as Array<KYCReview> : kyc.KycReviews.KycReviews.get(appID.value))
const reviewLoading = ref(false)

const getAppKycReviews = (offset: number, limit: number) => {
  kyc.getAppKycReviews({
    TargetAppID: appID.value,
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: t('MSG_GET_KYC_REVIEWS'),
        Message: t('MSG_GET_KYC_REVIEWS_FAIL'),
        Popup: true,
        Type: NotifyType.Error
      }
    }
  }, (reviews: Array<KYCReview>, error: boolean) => {
    if (error || reviews.length < limit) {
      reviewLoading.value = false
      return
    }
    getAppKycReviews(offset + limit, limit)
  })
}
const prepare = () => {
  if (!kyc.KycReviews.KycReviews.get(appID.value)) {
    reviewLoading.value = true
    getAppKycReviews(0, 500)
  }
  if (!user.Users.get(appID.value)) {
    reviewLoading.value = true
    getAppUsers(0, 500)
  }
}

watch(appID, () => {
  prepare()
})

const user = useChurchUserStore()
onMounted(() => {
  prepare()
})

const showing = ref(false)
const target = ref({} as KYCReview)
const targetUser = ref({} as User)
const images = computed(() => kyc.Images.get(target.value.KycID))

const onMenuHide = () => {
  showing.value = false
  target.value = {} as unknown as KYCReview
  targetUser.value = {} as unknown as User
}

const getTargetUser = (userID: string) => {
  const u = user.Users.get(appID.value)?.find((ul) => ul.ID === userID)
  return !u ? {} as User : u
}
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
      reviewLoading.value = false
      return
    }
    getAppUsers(offset + limit, limit)
  })
}

const onRowClick = (row: KYCReview) => {
  target.value = { ...row }
  targetUser.value = { ...getTargetUser(row.UserID) }
  showing.value = true
  kyc.getAppUserKYCImage({
    TargetAppID: appID.value,
    TargetUserID: row.UserID,
    ImageType: ImageType.FrontImg,
    Message: {
      Error: {
        Title: t('MSG_GET_KYC_IMAGES'),
        Message: t('MSG_GET_KYC_IMAGES_FAIL'),
        Popup: true,
        Type: NotifyType.Error
      }
    }
  }, target.value.KycID, () => {
    kyc.getAppUserKYCImage({
      TargetAppID: appID.value,
      TargetUserID: row.UserID,
      ImageType: ImageType.SelfieImg,
      Message: {
        Error: {
          Title: t('MSG_GET_KYC_IMAGES'),
          Message: t('MSG_GET_KYC_IMAGES_FAIL'),
          Popup: true,
          Type: NotifyType.Error
        }
      }
    }, target.value.KycID, () => {
      if (target?.value?.DocumentType === DocumentType.Passport) {
        showing.value = true
        return
      }
      kyc.getAppUserKYCImage({
        TargetAppID: appID.value,
        TargetUserID: row.UserID,
        ImageType: ImageType.BackImg,
        Message: {
          Error: {
            Title: t('MSG_GET_KYC_IMAGES'),
            Message: t('MSG_GET_KYC_IMAGES_FAIL'),
            Popup: true,
            Type: NotifyType.Error
          }
        }
      }, target.value.KycID, () => {
        showing.value = true
      })
    })
  })
}

const updateReview = (state: KYCReviewState) => {
  if (state === KYCReviewState.Rejected && target.value.Message.length === 0) {
    console.log('message is required')
    return
  }

  kyc.updateAppKycReview({
    TargetAppID: appID.value,
    ReviewID: target.value?.ReviewID,
    LangID: locale.AppLang?.LangID,
    State: state,
    Message: target.value.Message,
    NotifyMessage: {
      Error: {
        Title: t('MSG_UPDATE_KYC_REVIEW'),
        Message: t('MSG_UPDATE_KYC_REVIEW_FAIL'),
        Popup: true,
        Type: NotifyType.Error
      }
    }
  }, (r:KYCReview, error: boolean) => {
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
