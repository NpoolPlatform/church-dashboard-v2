<template>
  <q-table
    dense
    flat
    :title='$t("MSG_EVENT_COUPONS")'
    :rows='coupons'
    row-key='ID'
    :loading='loading'
    :rows-per-page-options='[10]'
    @row-click='(evt, row, index) => onRowClick(row as EventCoupon)'
  >
    <template #top-right>
      <div class='row indent flat'>
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
        <span>{{ $t('MSG_CREATE_EVENT_COUPON') }}</span>
      </q-card-section>
      <q-card-section>
        <q-select :options='activities' v-model='selectedActivity' :label='$t("MSG_ACTIVITY")' />
        <q-select :options='CouponEvents' v-model='target.Event' :label='$t("MSG_COUPON_EVENT")' />
        <q-select :options='EventCouponTypes' v-model='target.Type' :label='$t("MSG_COUPON_TYPE")' />
        <q-select
          v-if='target.Type === CouponType.FixAmount'
          :options='fixAmounts'
          v-model='selectedFixAmount'
          :label='$t("MSG_FIX_AMOUNT_COUPON")'
        />
        <q-select
          v-if='target.Type === CouponType.Discount'
          :options='discounts'
          v-model='selectedDiscount'
          :label='$t("MSG_DISCOUNT_COUPON")'
        />
        <q-input type='number' v-model='target.Count' :label='$t("MSG_COUPON_COUNT")' />
      </q-card-section>
      <q-item class='row'>
        <q-btn class='btn round alt' :label='$t("MSG_SUBMIT")' @click='onSubmit' />
        <q-btn class='btn round' :label='$t("MSG_CANCEL")' @click='onCancel' />
      </q-item>
    </q-card>
  </q-dialog>
</template>

<script setup lang='ts'>
import {
  NotificationType,
  EventCoupon,
  useLoginedUserStore,
  useChurchEventCouponStore,
  useEventCouponStore,
  useChurchFixAmountStore,
  FixAmountCoupon,
  EventCouponTypes,
  CouponType,
  useChurchDiscountStore,
  DiscountCoupon,
  PriceCoinName,
  CouponEvents,
  Activity,
  useChurchActivityStore
} from 'npool-cli-v2'
import { computed, onMounted, watch, ref } from 'vue'
import { useLocalApplicationStore } from '../../localstore'
import { useI18n } from 'vue-i18n'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const app = useLocalApplicationStore()
const appID = computed(() => app.AppID)

const coupon = useChurchEventCouponStore()
const acoupon = useEventCouponStore()
const coupons = computed(() => coupon.EventCoupons.get(appID.value) ? coupon.EventCoupons.get(appID.value) : [])
const loading = ref(true)

interface MyFixAmount {
  label: string
  value: FixAmountCoupon
}

const fixAmount = useChurchFixAmountStore()
const appFixAmounts = computed(() => {
  return fixAmount.FixAmounts.get(appID.value) ? fixAmount.FixAmounts.get(appID.value) as Array<FixAmountCoupon> : []
})
const fixAmounts = computed(() => Array.from(appFixAmounts.value).map((el) => {
  return {
    label: el.Name + ' | ' + el.Denomination.toString(),
    value: el
  } as MyFixAmount
}))
const selectedFixAmount = computed({
  get: () => {
    if (!target.value.Type && target.value.Type !== CouponType.FixAmount) {
      return undefined as unknown as MyFixAmount
    }
    const coupon = fixAmount.getFixAmountByAppID(appID.value, target.value.CouponID)
    if (!coupon) {
      return undefined as unknown as MyFixAmount
    }
    return {
      label: coupon?.Name + ' | ' + coupon?.Denomination?.toString() + PriceCoinName,
      value: coupon
    } as MyFixAmount
  },
  set: (val) => {
    target.value.CouponID = val.value.ID as string
  }
})

interface MyDiscount {
  label: string
  value: DiscountCoupon
}

const discount = useChurchDiscountStore()
const appDiscounts = computed(() => {
  return discount.Discounts.get(appID.value) ? discount.Discounts.get(appID.value) as Array<DiscountCoupon> : []
})
const discounts = computed(() => Array.from(appDiscounts.value).map((el) => {
  return {
    label: el.Name + ' | ' + el.Discount.toString() + '%',
    value: el
  } as MyDiscount
}))
const selectedDiscount = computed({
  get: () => {
    if (!target.value.Type && target.value.Type !== CouponType.Discount) {
      return undefined as unknown as MyDiscount
    }
    const coupon = discount.getDiscountByAppID(appID.value, target.value.CouponID)
    if (!coupon) {
      return undefined as unknown as MyDiscount
    }
    return {
      label: coupon?.Name + ' | ' + coupon?.Discount.toString() + '%',
      value: coupon
    } as MyDiscount
  },
  set: (val) => {
    target.value.CouponID = val.value.ID as string
  }
})

interface MyActivity {
  label: string
  value: Activity
}

const activity = useChurchActivityStore()
const appActivities = computed(() => {
  return activity.Activities.get(appID.value) ? activity.Activities.get(appID.value) as Array<Activity> : []
})
const activities = computed(() => Array.from(appActivities.value).map((el) => {
  return {
    label: el.Name,
    value: el
  } as MyActivity
}))
const selectedActivity = computed({
  get: () => {
    const coupon = activity.getActivityByAppID(appID.value, target.value.ActivityID)
    if (!coupon) {
      return undefined as unknown as MyActivity
    }
    return {
      label: coupon?.Name,
      value: coupon
    } as MyActivity
  },
  set: (val) => {
    target.value.ActivityID = val.value.ID as string
  }
})

const logined = useLoginedUserStore()

const prepare = () => {
  loading.value = true
  coupon.getEventCoupons({
    TargetAppID: appID.value,
    Message: {
      Error: {
        Title: t('MSG_GET_EVENT_COUPONS'),
        Message: t('MSG_GET_EVENT_COUPONS_FAIL'),
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, () => {
    loading.value = false
  })

  fixAmount.getFixAmounts({
    TargetAppID: appID.value,
    Message: {
      Error: {
        Title: t('MSG_GET_FIX_AMOUNTS'),
        Message: t('MSG_GET_FIX_AMOUNTS_FAIL'),
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, () => {
    // TODO
  })

  discount.getDiscounts({
    TargetAppID: appID.value,
    Message: {
      Error: {
        Title: t('MSG_GET_DISCOUNTS'),
        Message: t('MSG_GET_DISCOUNTS_FAIL'),
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, () => {
    // TODO
  })

  activity.getActivities({
    TargetAppID: appID.value,
    Message: {
      Error: {
        Title: t('MSG_GET_ACTIVITIES'),
        Message: t('MSG_GET_ACTIVITIES_FAIL'),
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, () => {
    // TODO
  })
}

watch(appID, () => {
  prepare()
})

onMounted(() => {
  prepare()
})

const showing = ref(false)
const updating = ref(false)
const target = ref({
  CreatedBy: logined.LoginedUser?.User.ID
} as unknown as EventCoupon)

const onCreate = () => {
  showing.value = true
  updating.value = false
}

const onRowClick = (activity: EventCoupon) => {
  showing.value = true
  updating.value = true
  target.value = activity
}

const onMenuHide = () => {
  showing.value = false
  target.value = {} as unknown as EventCoupon
}

const onSubmit = () => {
  showing.value = false

  if (updating.value) {
    acoupon.updateEventCoupon({
      Info: target.value,
      Message: {
        Error: {
          Title: 'MSG_UPDATE_EVENT_COUPON',
          Message: 'MSG_UPDATE_EVENT_COUPON_FAIL',
          Popup: true,
          Type: NotificationType.Error
        }
      }
    }, () => {
      // TODO
    })
    return
  }

  coupon.createEventCoupon({
    TargetAppID: appID.value,
    Info: target.value,
    Message: {
      Error: {
        Title: 'MSG_CREATE_EVENT_COUPON',
        Message: 'MSG_CREATE_EVENT_COUPON_FAIL',
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, () => {
    // TODO
  })
}

const onCancel = () => {
  showing.value = false
}

</script>
