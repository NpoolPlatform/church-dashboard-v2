<template>
  <q-table
    dense
    flat
    :title='$t("MSG_USERS")'
    :rows='displayUsers'
    row-key='ID'
    :loading='loading'
    :rows-per-page-options='[10]'
    selection='multiple'
    v-model:selected='selectedUsers'
    :columns='columns'
  >
    <template #top-right>
      <div class='row indent flat'>
        <q-btn
          dense
          flat
          class='btn flat'
          :label='$t("MSG_AIRDROP")'
          @click='onDo'
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
        <q-select :options='EventCouponTypes' v-model='couponType' :label='$t("MSG_COUPON_TYPE")' />
        <q-select
          v-if='couponType === CouponType.FixAmount'
          :options='fixAmounts'
          v-model='selectedFixAmount'
          :label='$t("MSG_FIX_AMOUNT_COUPON")'
        />
        <q-select
          v-if='couponType=== CouponType.Discount'
          :options='discounts'
          v-model='selectedDiscount'
          :label='$t("MSG_DISCOUNT_COUPON")'
        />
        <q-input type='number' v-model='airdropCount' :label='$t("MSG_COUPON_COUNT")' />
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
  useChurchFixAmountStore,
  FixAmountCoupon,
  EventCouponTypes,
  CouponType,
  useChurchDiscountStore,
  DiscountCoupon,
  useChurchUserCouponStore
} from 'npool-cli-v2'
import { computed, onMounted, watch, ref } from 'vue'
import { useLocalApplicationStore } from '../../localstore'
import { useI18n } from 'vue-i18n'
import { formatTime, NotifyType, useChurchUserStore, User } from 'npool-cli-v4'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })
const columns = computed(() => [
  {
    name: 'AppID',
    label: t('MSG_APP_ID'),
    field: (row: User) => row.AppID
  },
  {
    name: 'UserID',
    label: t('MSG_USER_ID'),
    field: (row: User) => row.ID
  },
  {
    name: 'EmailAddress',
    label: t('MSG_EMAIL_ADDRESS'),
    field: (row: User) => row.EmailAddress
  },
  {
    name: 'PhoneNO',
    label: t('MSG_PHONE_NO'),
    field: (row: User) => row.PhoneNO
  },
  {
    name: 'Roles',
    label: t('MSG_ROLES'),
    field: (row: User) => row.Roles.join(',')
  },
  {
    name: 'CreatedAt',
    label: t('MSG_CREATEDAT'),
    field: (row: User) => formatTime(row.CreatedAt)
  }
])
const app = useLocalApplicationStore()
const appID = computed(() => app.AppID)

const coupon = useChurchUserCouponStore()

const user = useChurchUserStore()
const appUsers = computed(() => user.Users.get(appID.value) ? user.Users.get(appID.value) as Array<User> : [])
const username = ref('')
const displayUsers = computed(() => appUsers.value.filter((user) => user.EmailAddress?.includes(username.value) || user.PhoneNO?.includes(username.value)))

const selectedUsers = ref([] as Array<User>)

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
const selectedFixAmount = ref(undefined as unknown as MyFixAmount)

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
const selectedDiscount = ref(undefined as unknown as MyDiscount)

const loading = ref(false)
const couponType = ref(undefined as unknown as CouponType)
const airdropCount = ref(1)
const couponID = ref(undefined as unknown as string)
watch(selectedDiscount, () => {
  couponID.value = selectedDiscount.value.value.ID as string
})
watch(selectedFixAmount, () => {
  couponID.value = selectedFixAmount.value.value.ID as string
})

const prepare = () => {
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

  if (!user.Users.get(appID.value)) {
    loading.value = true
    getAppUsers(0, 500)
  }
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
  }, (users: Array<User>, error: boolean) => {
    if (error || users.length < limit) {
      loading.value = false
      return
    }
    getAppUsers(offset + limit, limit)
  })
}
watch(appID, () => {
  prepare()
})

onMounted(() => {
  prepare()
})

const showing = ref(false)
const onDo = () => {
  showing.value = true
}

const onMenuHide = () => {
  showing.value = false
}

const onSubmit = () => {
  showing.value = false
  selectedUsers.value.forEach((user) => {
    coupon.createUserCoupon({
      TargetAppID: appID.value,
      TargetUserID: user.ID,
      Info: {
        Type: couponType.value,
        CouponID: couponID.value
      },
      Message: {
        Error: {
          Title: t('MSG_CREATE_USER_COUPONS'),
          Message: t('MSG_CREATE_USER_COUPONS_FAIL'),
          Popup: true,
          Type: NotificationType.Error
        }
      }
    }, () => {
      // TODO
    })
  })
}

const onCancel = () => {
  showing.value = false
}

</script>
