<template>
  <q-table
    dense
    flat
    :title='$t("MSG_DISCOUNTS")'
    :rows='coupons'
    row-key='ID'
    :loading='loading'
    :rows-per-page-options='[10]'
    @row-click='(evt, row, index) => onRowClick(row as Coupon)'
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
        <span>{{ $t('MSG_CREATE_DISCOUNT') }}</span>
      </q-card-section>
      <q-card-section>
        <q-input v-model='target.Name' :label='$t("MSG_COUPON_NAME")' />
        <q-input v-model='target.Message' :label='$t("MSG_COUPON_DESCRIPTION")' />
        <q-input type='date' v-model='start' :label='$t("MSG_START")' />
        <q-input type='number' v-model='target.DurationDays' :label='$t("MSG_DURATION_DAYS")' :suffix='$t("MSG_DAYS")' />
        <q-input type='number' v-model='target.Denomination' :label='$t("MSG_COUPON_CIRCULATION")' suffix='%' />
      </q-card-section>
      <q-item class='row'>
        <q-btn class='btn round alt' :label='$t("MSG_SUBMIT")' @click='onSubmit' />
        <q-btn class='btn round' :label='$t("MSG_CANCEL")' @click='onCancel' />
      </q-item>
    </q-card>
  </q-dialog>
</template>

<script setup lang='ts'>
import { formatTime } from 'npool-cli-v2'
import { computed, onMounted, watch, ref } from 'vue'
import { useLocalApplicationStore } from '../../localstore'
import { useI18n } from 'vue-i18n'
import { useLocalUserStore, NotifyType } from 'npool-cli-v4'
import { useCouponStore, CouponType, Coupon } from 'src/teststore/inspire/coupon'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const app = useLocalApplicationStore()
const appID = computed(() => app.AppID)

const coupon = useCouponStore()
const coupons = computed(() => coupon.coupons(appID.value, CouponType.Discount))
const loading = ref(true)

const logined = useLocalUserStore()

const prepare = () => {
  loading.value = true
  coupon.getAppCoupons({
    TargetAppID: appID.value,
    CouponType: CouponType.Discount,
    Offset: 0,
    Limit: 100,
    Message: {
      Error: {
        Title: t('MSG_GET_DISCOUNTS'),
        Message: t('MSG_GET_DISCOUNTS_FAIL'),
        Popup: true,
        Type: NotifyType.Error
      }
    }
  }, () => {
    loading.value = false
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
  IssuedBy: logined.User?.ID
} as unknown as Coupon)
const start = computed({
  get: () => formatTime(target.value.StartAt, true)?.replace(/\//g, '-'),
  set: (val) => {
    target.value.StartAt = new Date(val).getTime() / 1000
  }
})

const onCreate = () => {
  showing.value = true
  updating.value = false
}

const onRowClick = (coupon: Coupon) => {
  showing.value = true
  updating.value = true
  target.value = coupon
}

const onMenuHide = () => {
  showing.value = false
  target.value = {
    IssuedBy: logined.User?.ID
  } as unknown as Coupon
}

const onSubmit = () => {
  showing.value = false

  if (updating.value) {
    coupon.updateCoupon({
      ID: target.value.ID,
      TargetAppID: appID.value,
      Denomination: target.value.Denomination,
      Circulation: target.value.Circulation,
      StartAt: target.value.StartAt,
      DurationDays: target.value.DurationDays,
      Message: target.value.Message,
      Name: target.value.Name,
      NotifyMessage: {
        Error: {
          Title: 'MSG_UPDATE_DISCOUNT',
          Message: 'MSG_UPDATE_DISCOUNT_FAIL',
          Popup: true,
          Type: NotifyType.Error
        },
        Info: {
          Title: 'MSG_UPDATE_DISCOUNT',
          Message: 'MSG_UPDATE_DISCOUNT_SUCCESS',
          Popup: true,
          Type: NotifyType.Success
        }
      }
    }, () => {
      // TODO
    })
    return
  }

  coupon.createCoupon({
    TargetAppID: appID.value,
    CouponType: CouponType.Discount,
    Denomination: target.value.Denomination,
    Circulation: target.value.Circulation,
    StartAt: target.value.StartAt,
    DurationDays: target.value.DurationDays,
    Message: target.value.Message,
    Name: target.value.Name,
    NotifyMessage: {
      Error: {
        Title: 'MSG_CREATE_DISCOUNT',
        Message: 'MSG_CREATE_DISCOUNT_FAIL',
        Popup: true,
        Type: NotifyType.Error
      },
      Info: {
        Title: 'MSG_CREATE_DISCOUNT',
        Message: 'MSG_CREATE_DISCOUNT_SUCCESS',
        Popup: true,
        Type: NotifyType.Success
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
