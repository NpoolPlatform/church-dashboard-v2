<template>
  <q-table
    dense
    flat
    :title='$t("MSG_EVENT_INSPIRE")'
    :rows='displayEvents'
    row-key='ID'
    :columns='columns'
    :rows-per-page-options='[100]'
    @row-click='(evt, row, index) => onRowClick(row as eventinspire.Event)'
  >
    <template #top-right>
      <div class='row indent flat'>
        <!-- <q-input
          dense
          flat
          class='small'
          v-model='username'
          :label='$t("MSG_USERNAME")'
        /> -->
        <q-btn
          dense
          flat
          class='btn flat'
          :label='$t("MSG_CREATE")'
          @click='onCreate'
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
        <span>{{ $t('MSG_EVENT_INSPIRE') }}</span>
      </q-card-section>
      <q-card-section>
        <q-select
          :disable='updating'
          :options='[
            basetypes.EventType.AffiliatePurchase,
            basetypes.EventType.Purchase,
            basetypes.EventType.Signup,
            basetypes.EventType.AffiliateSignup,
            basetypes.EventType.SimulateOrderProfit,
            basetypes.EventType.SetWithdrawAddress,
            basetypes.EventType.ConsecutiveLogin,
            basetypes.EventType.GoodSocialSharing,
            basetypes.EventType.FirstOrderCompleted,
            basetypes.EventType.SetAddress,
            basetypes.EventType.Set2FA,
            basetypes.EventType.FirstBenefit,
            basetypes.EventType.WriteComment,
            basetypes.EventType.WriteRecommend,
            basetypes.EventType.GoodScoring,
            basetypes.EventType.SubmitTicket,
            basetypes.EventType.IntallApp,
            basetypes.EventType.SetNFTAvatar,
            basetypes.EventType.SetPersonalImage,
            basetypes.EventType.Signin,
            basetypes.EventType.KYCApproved,
            basetypes.EventType.OrderCompleted,
            basetypes.EventType.WithdrawalCompleted,
            basetypes.EventType.DepositReceived,
            basetypes.EventType.UpdatePassword,
            basetypes.EventType.ResetPassword,
            basetypes.EventType.InternalTransfer,
          ]'
          v-model='target.EventType'
          :label='$t("MSG_EVENT_TYPE")'
        />
      </q-card-section>
      <q-card-section
        v-if='target.EventType === basetypes.EventType.AffiliatePurchase ||
          target.EventType === basetypes.EventType.Purchase ||
          basetypes.EventType.Signup ||
          basetypes.EventType.AffiliateSignup'
      >
        <AppGoodSelector v-model:id='target.AppGoodID' v-if='!updating' :label='$t("MSG_GOOD")' />
        <CouponSelectors v-model:ids='couponIDs' />
      </q-card-section>
      <q-card-section>
        <q-input type='number' v-model='target.Credits' :label='$t("MSG_CREDIT")' />
        <q-input type='number' v-model='target.CreditsPerUSD' :label='$t("MSG_CREDIT_PERUSD")' />
      </q-card-section>
      <q-card-section>
        <q-input type='number' v-model.number='target.MaxConsecutive' :label='$t("MSG_MAX_CONSECUTIVE")' />
        <q-input type='number' v-model.number='target.InviterLayers' :label='$t("MSG_INVITER_LAYERS")' />
      </q-card-section>
      <q-card-section>
        <CoinSelectors v-model:coins='coins' :label='$t("MSG_COINS")' />
      </q-card-section>
      <q-item class='row'>
        <LoadingButton loading :label='$t("MSG_SUBMIT")' @click='onSubmit' />
        <q-btn class='btn round' :label='$t("MSG_CANCEL")' @click='onCancel' />
      </q-item>
    </q-card>
  </q-dialog>
  <q-card-section class='bg-primary text-white'>
    {{ $t('MSG_ADVERTISEMENT_POSITION') }}
  </q-card-section>
</template>

<script setup lang='ts'>
import { getCoupons } from 'src/api/inspire'
import { AppID } from 'src/api/app'
import { coupon, basetypes, eventinspire, utils, notify } from 'src/npoolstore'
import { computed, defineAsyncComponent, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const LoadingButton = defineAsyncComponent(() => import('src/components/button/LoadingButton.vue'))
const AppGoodSelector = defineAsyncComponent(() => import('src/components/good/AppGoodSelector.vue'))
const CouponSelectors = defineAsyncComponent(() => import('src/components/inspire/CouponSelectors.vue'))
const CoinSelectors = defineAsyncComponent(() => import('src/components/inspire/CoinSelect.vue'))

const _coupon = coupon.useCouponStore()
const event = eventinspire.useEventStore()
const events = computed(() => event.events())
const couponIDs = ref([] as Array<string>)
const coins = ref([] as Array<eventinspire.EventCoinReq>)

// const username = ref('')
const displayEvents = computed(() => events.value.filter((el) => {
  return el
}))

const target = ref({} as eventinspire.Event)
const showing = ref(false)
const updating = ref(false)

const onCreate = () => {
  target.value = { MaxConsecutive: 1, InviterLayers: 1 } as eventinspire.Event
  couponIDs.value = []
  showing.value = true
  updating.value = false
  coins.value = []
}
const onRowClick = (row: eventinspire.Event) => {
  target.value = { ...row }
  console.log('target: ', target.value.EventCoins)
  couponIDs.value = target.value.Coupons.map((el) => el.EntID)
  coins.value = target.value.EventCoins
  showing.value = true
  updating.value = true
}
const onMenuHide = () => {
  showing.value = false
  target.value = {} as eventinspire.Event
}
const onCancel = () => {
  onMenuHide()
}

const onSubmit = (done: () => void) => {
  updating.value ? updateEvent(done) : createEvent(done)
}

const updateEvent = (done: () => void) => {
  event.adminUpdateEvent({
    TargetAppID: AppID.value,
    ...target.value,
    CouponIDs: couponIDs.value,
    Coins: coins.value,
    Message: {
      Error: {
        Title: t('MSG_UPDATE_EVENT'),
        Message: t('MSG_UPDATE_EVENT_FAIL'),
        Popup: true,
        Type: notify.NotifyType.Error
      },
      Info: {
        Title: t('MSG_UPDATE_EVENT'),
        Message: t('MSG_UPDATE_EVENT_SUCCESS'),
        Popup: true,
        Type: notify.NotifyType.Success
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

const createEvent = (done: () => void) => {
  console.log('create event')
  console.log('create event: TargetAppID: ', AppID.value)
  console.log('create event: target: ', target.value)
  console.log('create event: CouponIDs: ', couponIDs.value)
  console.log('create event: Coins: ', coins.value)
  event.adminCreateEvent({
    TargetAppID: AppID.value,
    ...target.value,
    CouponIDs: couponIDs.value,
    Coins: coins.value,
    Message: {
      Error: {
        Title: t('MSG_CREATE_EVENT'),
        Message: t('MSG_CREATE_EVENT_FAIL'),
        Popup: true,
        Type: notify.NotifyType.Error
      },
      Info: {
        Title: t('MSG_CREATE_EVENT'),
        Message: t('MSG_CREATE_EVENT_FAIL'),
        Popup: true,
        Type: notify.NotifyType.Success
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
  if (event.events()?.length === 0) {
    getEvents(0, 500)
  }
  if (_coupon.coupons()?.length === 0) {
    getCoupons(0, 500)
  }
})

const getEvents = (offset: number, limit: number) => {
  event.adminGetEvents({
    TargetAppID: AppID.value,
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: t('MSG_GET_EVENT_FAIL'),
        Popup: true,
        Type: notify.NotifyType.Error
      }
    }
  }, (error: boolean, rows?: Array<eventinspire.Event>) => {
    if (error) {
      return
    }
    if (!rows?.length) {
      return
    }
    getEvents(offset + limit, limit)
  })
}

const eventCoupons = computed(() => (rows: coupon.Coupon[]) => {
  let str = ''
  rows.forEach((el) => {
    str += `${el.ID} | ${el.CouponType} | ${el.Name} | ${el.Denomination}  ;  `
  })
  return str
})

const columns = computed(() => [
  {
    name: 'ID',
    label: t('MSG_ID'),
    field: (row: eventinspire.Event) => row.ID
  },
  {
    name: 'EntID',
    label: t('MSG_ENT_ID'),
    field: (row: eventinspire.Event) => row.EntID
  },
  {
    name: 'AppName',
    label: t('MSG_APP_NAME'),
    field: (row: eventinspire.Event) => row.AppName
  },
  {
    name: 'EventType',
    label: t('MSG_EVENT_TYPE'),
    field: (row: eventinspire.Event) => row.EventType
  },
  {
    name: 'Coupons',
    label: t('MSG_COUPONS'),
    field: (row: eventinspire.Event) => eventCoupons.value(row.Coupons)
  },
  {
    name: 'Credits',
    label: t('MSG_CREDITS'),
    field: (row: eventinspire.Event) => row.Credits
  },
  {
    name: 'CreditsPerUSD',
    label: t('MSG_CREDITS_PERUSD'),
    field: (row: eventinspire.Event) => row.CreditsPerUSD
  },
  {
    name: 'MaxConsecutive',
    label: t('MSG_MAX_CONSECUTIVE'),
    field: (row: eventinspire.Event) => row.MaxConsecutive
  },
  {
    name: 'GoodID',
    label: t('MSG_GOOD_ID'),
    field: (row: eventinspire.Event) => row.GoodID
  },
  {
    name: 'GoodName',
    label: t('MSG_GOOD_NAME'),
    field: (row: eventinspire.Event) => row.GoodName
  },
  {
    name: 'InviterLayers',
    label: t('MSG_INVITER_LAYERS'),
    field: (row: eventinspire.Event) => row.InviterLayers
  },
  {
    name: 'CreatedAt',
    label: t('MSG_CREATED_AT'),
    sortable: true,
    field: (row: eventinspire.Event) => utils.formatTime(row.CreatedAt)
  },
  {
    name: 'UpdatedAt',
    label: t('MSG_UPDATED_AT'),
    sortable: true,
    field: (row: eventinspire.Event) => utils.formatTime(row.UpdatedAt)
  }
])
</script>
