<template>
  <q-table
    v-if='true'
    dense
    flat
    :title='$t("MSG_EVENT_INSPIRE")'
    :rows='displayEvents'
    row-key='ID'
    :rows-per-page-options='[100]'
    selection='single'
    :columns='columns'
    v-model:selected='selectedEvents'
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
          target.EventType === basetypes.EventType.Signup ||
          target.EventType === basetypes.EventType.AffiliateSignup'
      >
        <AppGoodSelector v-model:app-good-id='target.AppGoodID' v-if='!updating' :label='$t("MSG_GOOD")' />
      </q-card-section>
      <q-card-section>
        <q-input type='number' v-model='target.Credits' :label='$t("MSG_CREDIT")' />
        <q-input type='number' v-model='target.CreditsPerUSD' :label='$t("MSG_CREDIT_PERUSD")' />
      </q-card-section>
      <q-card-section>
        <q-input type='number' v-model.number='target.MaxConsecutive' :label='$t("MSG_MAX_CONSECUTIVE")' />
        <q-input type='number' v-model.number='target.InviterLayers' :label='$t("MSG_INVITER_LAYERS")' />
      </q-card-section>
      <q-item class='row'>
        <LoadingButton loading :label='$t("MSG_SUBMIT")' @click='onSubmit' />
        <q-btn class='btn round' :label='$t("MSG_CANCEL")' @click='onCancel' />
      </q-item>
    </q-card>
  </q-dialog>
  <q-table
    :title='$t("MSG_EVENT_COINS")'
    v-if='false'
    dense
    :rows='displayEventCoins'
    row-key='ID'
    :rows-per-page-options='[100]'
    selection='single'
    v-model:selected='selectedEventCoins'
    :columns='eventCoinColumns'
    @row-click='(evt, row, index) => onEventCoinRowClick(row as eventcoininspire.EventCoin)'
  >
    <template #top-right>
      <div class='row indent flat'>
        <q-btn
          dense
          flat
          class='btn flat'
          :label='$t("MSG_CREATE_EVENT_COIN")'
          @click='onEventCoinCreate()'
          :disable='selectedEvents.length === 0 || selectedEvents.length === 0'
        />
        <q-btn
          dense
          flat
          class='btn flat'
          :label='$t("MSG_DELETE_EVENT_COIN")'
          @click='onDeleteEventCoinClick'
          :disable='selectedEventCoins.length === 0'
        />
      </div>
    </template>
  </q-table>
  <q-dialog
    v-model='eventCoinShowing'
    @hide='onEventCoinMenuHide'
    position='right'
  >
    <q-card class='popup-menu'>
      <q-card-section>
        <span>{{ $t('MSG_EVENT_COIN') }}</span>
      </q-card-section>
      <q-card-section>
        <CoinConfigPicker v-model:id='eventCoinTarget.CoinConfigID' :updating='eventCoinUpdating' />
      </q-card-section>
      <q-card-section>
        <q-input v-model='eventCoinTarget.CoinValue' :label='$t("MSG_COIN_VALUE")' />
        <q-input v-model='eventCoinTarget.CoinPerUSD' :label='$t("MSG_COIN_PER_USD")' />
      </q-card-section>
      <q-item class='row'>
        <LoadingButton loading :label='$t("MSG_SUBMIT")' @click='onEventCoinSubmit' />
        <q-btn class='btn round' :label='$t("MSG_CANCEL")' @click='onEventCoinCancel' />
      </q-item>
    </q-card>
  </q-dialog>
  <q-table
    :title='$t("MSG_EVENT_COUPONS")'
    dense
    v-if='true'
    :rows='displayEventCoupons'
    row-key='ID'
    :rows-per-page-options='[100]'
    selection='single'
    :columns='eventCouponColumns'
    v-model:selected='selectedEventCoupons'
  >
    <template #top-right>
      <div class='row indent flat'>
        <q-btn
          dense
          flat
          class='btn flat'
          :label='$t("MSG_CREATE_EVENT_COUPON")'
          @click='onEventCouponCreate()'
          :disable='selectedEvents.length === 0 || selectedEvents.length === 0'
        />
        <q-btn
          dense
          flat
          class='btn flat'
          :label='$t("MSG_DELETE_EVENT_COUPON")'
          @click='onDeleteEventCouponClick'
          :disable='selectedEventCoupons.length === 0'
        />
      </div>
    </template>
  </q-table>
  <q-dialog
    v-model='eventCouponShowing'
    @hide='onEventCouponMenuHide'
    position='right'
  >
    <q-card class='popup-menu'>
      <q-card-section>
        <span>{{ $t('MSG_EVENT_COUPON') }}</span>
      </q-card-section>
      <q-card-section>
        <CouponSelector v-model:id='eventCouponTarget.CouponID' />
      </q-card-section>
      <q-item class='row'>
        <LoadingButton loading :label='$t("MSG_SUBMIT")' @click='onEventCouponSubmit' />
        <q-btn class='btn round' :label='$t("MSG_CANCEL")' @click='onEventCouponCancel' />
      </q-item>
    </q-card>
  </q-dialog>
  <q-card-section class='bg-primary text-white'>
    {{ $t('MSG_ADVERTISEMENT_POSITION') }}
  </q-card-section>
</template>

<script setup lang='ts'>
import { AppID } from 'src/npoolstore/sdk'
import { basetypes, eventinspire, eventcoininspire, eventcouponinspire, utils, notify } from 'src/npoolstore'
import { computed, defineAsyncComponent, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const LoadingButton = defineAsyncComponent(() => import('src/components/button/LoadingButton.vue'))
const AppGoodSelector = defineAsyncComponent(() => import('src/components/good/AppGoodSelector.vue'))
const CoinConfigPicker = defineAsyncComponent(() => import('src/components/inspire/CoinConfigPicker.vue'))
const CouponSelector = defineAsyncComponent(() => import('src/components/inspire/CouponSelector.vue'))

const event = eventinspire.useEventStore()
const events = computed(() => event.events())

const evetcoin = eventcoininspire.useEventCoinStore()
const eventcoins = computed(() => evetcoin.eventcoins())

const evetcoupon = eventcouponinspire.useEventCouponStore()
const eventcoupons = computed(() => evetcoupon.eventcoupons())

// const username = ref('')
const displayEvents = computed(() => events.value.filter((el) => {
  return el
}))

const target = ref({} as eventinspire.Event)
const showing = ref(false)
const updating = ref(false)

const onCreate = () => {
  target.value = { MaxConsecutive: 1, InviterLayers: 1 } as eventinspire.Event
  showing.value = true
  updating.value = false
}
const onRowClick = (row: eventinspire.Event) => {
  target.value = { ...row }
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

const selectedEvents = ref([] as Array<eventinspire.Event>)
const selectedEventCoins = ref([] as Array<eventcoininspire.EventCoin>)
const selectedEventCoupons = ref([] as Array<eventcouponinspire.EventCoupon>)

const displayEventCoins = computed(() => eventcoins.value?.filter((eventcoin) => {
  return selectedEvents.value.length === 0 || eventcoin.EventID === selectedEvents.value[0]?.EntID
}))

const eventCoinTarget = ref({} as eventcoininspire.EventCoin)
const eventCoinShowing = ref(false)
const eventCoinUpdating = ref(false)

const onEventCoinCreate = () => {
  eventCoinTarget.value = {} as eventcoininspire.EventCoin
  eventCoinShowing.value = true
  eventCoinUpdating.value = false
}
const onEventCoinRowClick = (row: eventcoininspire.EventCoin) => {
  eventCoinTarget.value = { ...row }
  eventCoinShowing.value = true
  eventCoinUpdating.value = true
}
const onEventCoinMenuHide = () => {
  eventCoinShowing.value = false
  eventCoinTarget.value = {} as eventcoininspire.EventCoin
}
const onEventCoinCancel = () => {
  onEventCoinMenuHide()
}

const onEventCoinSubmit = (done: () => void) => {
  eventCoinUpdating.value ? updateEventCoin(done) : createEventCoin(done)
}

const displayEventCoupons = computed(() => eventcoupons.value.filter((eventcoupon) => {
  return selectedEvents.value.length === 0 || eventcoupon.EventID === selectedEvents.value[0]?.EntID
}))

const eventCouponTarget = ref({} as eventcouponinspire.EventCoupon)
const eventCouponShowing = ref(false)

const onEventCouponCreate = () => {
  eventCouponTarget.value = {} as eventcouponinspire.EventCoupon
  eventCouponShowing.value = true
}

const onEventCouponMenuHide = () => {
  eventCouponShowing.value = false
  eventCouponTarget.value = {} as eventcouponinspire.EventCoupon
}
const onEventCouponCancel = () => {
  onEventCouponMenuHide()
}

const onEventCouponSubmit = (done: () => void) => {
  createEventCoupon(done)
}

const updateEvent = (done: () => void) => {
  event.adminUpdateEvent({
    TargetAppID: AppID.value,
    ...target.value,
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
  event.adminCreateEvent({
    TargetAppID: AppID.value,
    ...target.value,
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
    getEventCoins(0, 500)
    getEventCoupons(0, 500)
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

const getEventCoins = (offset: number, limit: number) => {
  evetcoin.adminGetEventCoins({
    TargetAppID: AppID.value,
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: t('MSG_GET_EVENT_COIN_FAIL'),
        Popup: true,
        Type: notify.NotifyType.Error
      }
    }
  }, (error: boolean, rows?: Array<eventcoininspire.EventCoin>) => {
    if (error) {
      return
    }
    if (!rows?.length) {
      return
    }
    getEventCoins(offset + limit, limit)
  })
}

const getEventCoupons = (offset: number, limit: number) => {
  evetcoupon.adminGetEventCoupons({
    TargetAppID: AppID.value,
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: t('MSG_GET_EVENT_COUPON_FAIL'),
        Popup: true,
        Type: notify.NotifyType.Error
      }
    }
  }, (error: boolean, rows?: Array<eventcouponinspire.EventCoupon>) => {
    if (error) {
      return
    }
    if (!rows?.length) {
      return
    }
    getEventCoupons(offset + limit, limit)
  })
}

const createEventCoin = (done: () => void) => {
  if (selectedEvents.value.length === 0) {
    return
  }
  eventCoinTarget.value.EventID = selectedEvents.value[0].EntID
  evetcoin.adminCreateEventCoin({
    TargetAppID: AppID.value,
    ...eventCoinTarget.value,
    Message: {
      Error: {
        Title: 'MSG_CREATE_ROLE_AUTH',
        Message: 'MSG_CREATE_ROLE_AUTH_FAIL',
        Popup: true,
        Type: notify.NotifyType.Error
      },
      Info: {
        Title: 'MSG_CREATE_ROLE_AUTH',
        Message: 'MSG_CREATE_ROLE_AUTH_FAIL',
        Popup: true,
        Type: notify.NotifyType.Success
      }
    }
  }, (error: boolean) => {
    done()
    if (error) {
      return
    }
    onEventCoinMenuHide()
  })
}

const updateEventCoin = (done: () => void) => {
  evetcoin.adminUpdateEventCoin({
    TargetAppID: AppID.value,
    ...eventCoinTarget.value,
    Message: {
      Error: {
        Title: t('MSG_UPDATE_EVENT_COIN'),
        Message: t('MSG_UPDATE_EVENT_COIN_FAIL'),
        Popup: true,
        Type: notify.NotifyType.Error
      },
      Info: {
        Title: t('MSG_UPDATE_EVENT_COIN'),
        Message: t('MSG_UPDATE_EVENT_COIN_SUCCESS'),
        Popup: true,
        Type: notify.NotifyType.Success
      }
    }
  }, (error: boolean) => {
    done()
    if (error) {
      return
    }
    onEventCoinMenuHide()
  })
}

const onDeleteEventCoinClick = () => {
  if (selectedEventCoins.value.length === 0) {
    return
  }

  evetcoin.adminDeleteEventCoin({
    ID: selectedEventCoins.value[0].ID,
    EntID: selectedEventCoins.value[0].EntID,
    Message: {
      Error: {
        Title: 'MSG_DELETE_EVENT_COINS',
        Message: 'MSG_DELETE_EVENT_COINS_FAIL',
        Popup: true,
        Type: notify.NotifyType.Error
      },
      Info: {
        Title: 'MSG_DELETE_EVENT_COINS',
        Message: 'MSG_DELETE_EVENT_COINS_FAIL',
        Popup: true,
        Type: notify.NotifyType.Success
      }
    }
  }, () => {
    // TODO
  })
}

const createEventCoupon = (done: () => void) => {
  if (selectedEvents.value.length === 0) {
    return
  }
  eventCouponTarget.value.EventID = selectedEvents.value[0].EntID
  evetcoupon.adminCreateEventCoupon({
    TargetAppID: AppID.value,
    ...eventCouponTarget.value,
    Message: {
      Error: {
        Title: 'MSG_CREATE_EVENT_COUPON',
        Message: 'MSG_CREATE_EVENT_COUPON_FAIL',
        Popup: true,
        Type: notify.NotifyType.Error
      },
      Info: {
        Title: 'MSG_CREATE_EVENT_COUPON',
        Message: 'MSG_CREATE_EVENT_COUPON_FAIL',
        Popup: true,
        Type: notify.NotifyType.Success
      }
    }
  }, (error: boolean) => {
    done()
    if (error) {
      return
    }
    onEventCouponMenuHide()
  })
}

const onDeleteEventCouponClick = () => {
  if (selectedEventCoupons.value.length === 0) {
    return
  }

  evetcoupon.adminDeleteEventCoupon({
    ID: selectedEventCoupons.value[0].ID,
    EntID: selectedEventCoupons.value[0].EntID,
    Message: {
      Error: {
        Title: 'MSG_DELETE_EVENT_COUPONS',
        Message: 'MSG_DELETE_EVENT_COUPONS_FAIL',
        Popup: true,
        Type: notify.NotifyType.Error
      },
      Info: {
        Title: 'MSG_DELETE_EVENT_COUPONS',
        Message: 'MSG_DELETE_EVENT_COUPONS_FAIL',
        Popup: true,
        Type: notify.NotifyType.Success
      }
    }
  }, () => {
    // TODO
  })
}

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

const eventCoinColumns = computed(() => [
  {
    name: 'ID',
    label: t('MSG_ID'),
    field: (row: eventcoininspire.EventCoin) => row.ID
  },
  {
    name: 'EntID',
    label: t('MSG_ENT_ID'),
    field: (row: eventcoininspire.EventCoin) => row.EntID
  },
  {
    name: 'AppID',
    label: t('MSG_APP_ID'),
    field: (row: eventcoininspire.EventCoin) => row.AppID
  },
  {
    name: 'EventID',
    label: t('MSG_EVENT_ID'),
    field: (row: eventcoininspire.EventCoin) => row.EventID
  },
  {
    name: 'CoinConfigID',
    label: t('MSG_COIN_CONFIG_ID'),
    field: (row: eventcoininspire.EventCoin) => row.CoinConfigID
  },
  {
    name: 'CoinTypeID',
    label: t('MSG_COIN_TYPE_ID'),
    field: (row: eventcoininspire.EventCoin) => row.CoinTypeID
  },
  {
    name: 'CoinValue',
    label: t('MSG_COIN_VALUE'),
    field: (row: eventcoininspire.EventCoin) => row.CoinValue
  },
  {
    name: 'CoinPerUSD',
    label: t('MSG_COIN_PER_USD'),
    field: (row: eventcoininspire.EventCoin) => row.CoinPerUSD
  },
  {
    name: 'CoinName',
    label: t('MSG_COIN_NAME'),
    field: (row: eventcoininspire.EventCoin) => row.CoinName
  },
  {
    name: 'DisplayNames',
    label: t('MSG_DISPLAY_NAMES'),
    field: (row: eventcoininspire.EventCoin) => row.DisplayNames
  },
  {
    name: 'CoinLogo',
    label: t('MSG_COIN_LOGO'),
    field: (row: eventcoininspire.EventCoin) => row.CoinLogo
  },
  {
    name: 'CoinUnit',
    label: t('MSG_COIN_UNIT'),
    field: (row: eventcoininspire.EventCoin) => row.CoinUnit
  }
])

const eventCouponColumns = computed(() => [
  {
    name: 'ID',
    label: t('MSG_ID'),
    field: (row: eventcouponinspire.EventCoupon) => row.ID
  },
  {
    name: 'EntID',
    label: t('MSG_ENT_ID'),
    field: (row: eventcouponinspire.EventCoupon) => row.EntID
  },
  {
    name: 'AppID',
    label: t('MSG_APP_ID'),
    field: (row: eventcouponinspire.EventCoupon) => row.AppID
  },
  {
    name: 'EventID',
    label: t('MSG_EVENT_ID'),
    field: (row: eventcouponinspire.EventCoupon) => row.EventID
  },
  {
    name: 'CouponID',
    label: t('MSG_COUPON_ID'),
    field: (row: eventcouponinspire.EventCoupon) => row.CouponID
  },
  {
    name: 'CouponType',
    label: t('MSG_COUPON_TYPE'),
    field: (row: eventcouponinspire.EventCoupon) => row.CouponType
  },
  {
    name: 'Denomination',
    label: t('MSG_DENOMINATION'),
    field: (row: eventcouponinspire.EventCoupon) => row.Denomination
  },
  {
    name: 'StartAt',
    label: t('MSG_START_AT'),
    field: (row: eventcouponinspire.EventCoupon) => utils.formatTime(row.StartAt)
  },
  {
    name: 'EndAt',
    label: t('MSG_END_AT'),
    field: (row: eventcouponinspire.EventCoupon) => utils.formatTime(row.EndAt)
  },
  {
    name: 'DurationDays',
    label: t('MSG_DURATION_DAYS'),
    field: (row: eventcouponinspire.EventCoupon) => row.DurationDays
  },
  {
    name: 'Name',
    label: t('MSG_NAME'),
    field: (row: eventcouponinspire.EventCoupon) => row.Name
  }
])
</script>
