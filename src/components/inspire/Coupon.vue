<template>
  <q-table
    dense
    flat
    :title='$t("MSG_COUPONS")'
    :rows='coupons'
    row-key='ID'
    :rows-per-page-options='[100]'
    :columns='columns'
    @row-click='(evt, row, index) => onRowClick(row as coupon.Coupon)'
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
        <span>{{ $t('MSG_COUPON') }}</span>
      </q-card-section>
      <q-card-section>
        <!-- <AppGoodSelector v-model:id='target.AppGoodID' :label='$t("MSG_GOOD")' /> -->
        <!-- <AppUserSelector v-model:id='target.UserID' /> -->
        <q-input v-model='target.Name' :label='$t("MSG_NAME")' />
        <q-input v-model='target.Message' :label='$t("MSG_MESSAGE")' />
        <q-select :disable='updating' :options='coupon.CouponTypes' v-model='target.CouponType' :label='$t("MSG_COUPON_TYPE")' />
        <q-select :options='coupon.CouponConstraints' v-model='target.CouponConstraint' :label='$t("MSG_COUPON_CONSTRAINT")' />
        <q-input v-model='target.Denomination' :label='$t("MSG_DENOMINATION")' />
        <q-input v-model='target.Circulation' :label='$t("MSG_CIRCULATION")' />
        <q-input v-model.number='target.DurationDays' :label='$t("MSG_DURATION_DAYS")' />
        <q-input v-model='target.Threshold' :label='$t("MSG_THRESHOLD")' />
        <q-select :options='coupon.CouponScopes' v-model='target.CouponScope' :label='$t("MSG_COUPON_SCOPE")' />
        <q-input v-model='target.CashableProbability' :label='$t("MSG_CASHABLE_PROBABILITY")' />
      </q-card-section>
      <q-card-section>
        <DateTimePicker v-model:date='target.StartAt' label='MSG_START_AT' />
        <DateTimePicker v-model:date='target.EndAt' label='MSG_END_AT' />
      </q-card-section>
      <q-card-section>
        <div><q-toggle dense v-model='target.Random' :label='$t("MSG_RANDOM")' /></div>
      </q-card-section>
      <q-item class='row'>
        <LoadingButton loading :label='$t("MSG_SUBMIT")' @click='onSubmit' />
        <q-btn class='btn round' :label='$t("MSG_CANCEL")' @click='onCancel' />
      </q-item>
    </q-card>
  </q-dialog>
  <CouponScope />
  <CouponCoin />
  <CashControl />
</template>

<script setup lang='ts'>
import { computed, defineAsyncComponent, onMounted, ref, watch } from 'vue'
import { coupon, sdk, utils } from 'src/npoolstore'
const DateTimePicker = defineAsyncComponent(() => import('src/components/date/DateTimePicker.vue'))
const LoadingButton = defineAsyncComponent(() => import('src/components/button/LoadingButton.vue'))
const CouponScope = defineAsyncComponent(() => import('src/components/inspire/CouponScope.vue'))
const CashControl = defineAsyncComponent(() => import('src/components/inspire/CashControl.vue'))

import { useI18n } from 'vue-i18n'
import { AppID } from 'src/npoolstore/sdk'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const _coupon = coupon.useCouponStore()
const coupons = computed(() => _coupon.coupons().sort((a, b) => a.CreatedAt > b.CreatedAt ? -1 : 1))

const target = ref({} as coupon.Coupon)
const showing = ref(false)
const updating = ref(false)

const onCreate = () => {
  target.value = { CouponScope: coupon.CouponScope.Whitelist } as coupon.Coupon
  showing.value = true
  updating.value = false
}
const onRowClick = (row: coupon.Coupon) => {
  target.value = { ...row }
  showing.value = true
  updating.value = true
}
const onMenuHide = () => {
  showing.value = false
  target.value = {} as coupon.Coupon
}
const onCancel = () => {
  onMenuHide()
}

const onSubmit = (done: () => void) => {
  if (updating.value) {
    sdk.updateCoupon(target.value, (error: boolean) => {
      done()
      if (error) {
        return
      }
      onMenuHide()
    })
    return
  }
  sdk.createCoupon(target.value, (error: boolean) => {
    done()
    if (error) {
      return
    }
    onMenuHide()
  })
}

watch(AppID, () => {
  if (!coupons.value?.length) {
    sdk.getAppCoupons(0, 0)
  }
})

onMounted(() => {
  if (!coupons.value?.length) {
    sdk.getAppCoupons(0, 0)
  }
})

const columns = computed(() => [
  {
    name: 'ID',
    label: t('MSG_ID'),
    sortable: true,
    field: (row: coupon.Coupon) => row.ID
  },
  {
    name: 'EntID',
    label: t('MSG_ENT_ID'),
    sortable: true,
    field: (row: coupon.Coupon) => row.EntID
  },
  {
    name: 'AppID',
    label: t('MSG_APP_ID'),
    sortable: true,
    field: (row: coupon.Coupon) => row.AppID
  },
  {
    name: 'Name',
    label: t('MSG_NAME'),
    sortable: true,
    field: (row: coupon.Coupon) => row.Name
  },
  {
    name: 'Message',
    label: t('MSG_MESSAGE'),
    sortable: true,
    field: (row: coupon.Coupon) => row.Message
  },
  {
    name: 'Type',
    label: t('MSG_TYPE'),
    sortable: true,
    field: (row: coupon.Coupon) => row.CouponType
  },
  {
    name: 'Scope',
    label: t('MSG_COUPON_SCOPE'),
    sortable: true,
    field: (row: coupon.Coupon) => row.CouponScope
  },
  {
    name: 'Denomination',
    label: t('MSG_DENOMINATION'),
    sortable: true,
    field: (row: coupon.Coupon) => row.Denomination
  },
  {
    name: 'Circulation',
    label: t('MSG_CIRCULATION'),
    sortable: true,
    field: (row: coupon.Coupon) => row.Circulation
  },
  {
    name: 'Allocated',
    label: t('MSG_ALLOCATED'),
    sortable: true,
    field: (row: coupon.Coupon) => row.Allocated
  },
  {
    name: 'DurationDays',
    label: t('MSG_DURATION_DAYS'),
    sortable: true,
    field: (row: coupon.Coupon) => row.DurationDays
  },
  {
    name: 'CouponConstraint',
    label: t('MSG_CONSTRAINT'),
    sortable: true,
    field: (row: coupon.Coupon) => row.CouponConstraint
  },
  {
    name: 'Random',
    label: t('MSG_RANDOM'),
    sortable: true,
    field: (row: coupon.Coupon) => row.Random
  },
  {
    name: 'CashableProbability',
    label: t('MSG_CASHABLE_PROBABILITY'),
    sortable: true,
    field: (row: coupon.Coupon) => row.CashableProbability
  },
  {
    name: 'StartAt',
    label: t('MSG_START_AT'),
    sortable: true,
    field: (row: coupon.Coupon) => utils.formatTime(row.StartAt)
  },
  {
    name: 'EndAt',
    label: t('MSG_END_AT'),
    sortable: true,
    field: (row: coupon.Coupon) => utils.formatTime(row.EndAt)
  },
  {
    name: 'CreatedAt',
    label: t('MSG_CREATED_AT'),
    sortable: true,
    field: (row: coupon.Coupon) => utils.formatTime(row.CreatedAt)
  }
])

</script>
