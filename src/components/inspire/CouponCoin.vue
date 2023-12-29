<template>
  <q-table
    dense
    flat
    :title='$t("MSG_COUPON_COIN")'
    :rows='displayCouponCoins'
    row-key='ID'
    :rows-per-page-options='[100]'
    selection='single'
    :columns='columns'
    v-model:selected='selectedCouponCoins'
  >
    <template #top-right>
      <div class='row indent flat'>
        <q-input
          dense
          flat
          class='small'
          v-model='username'
          :label='$t("MSG_USERNAME")'
        />
      </div>
      <q-btn
        dense
        flat
        class='btn flat'
        :label='$t("MSG_DELETE")'
        :disable='selectedCouponCoins?.length === 0'
        @click='onDelete'
      />
      <q-btn
        dense
        flat
        class='btn flat'
        :label='$t("MSG_CREATE")'
        @click='onCreate'
      />
    </template>
  </q-table>

  <q-dialog
    v-model='showing'
    @hide='onMenuHide'
    position='right'
  >
    <q-card class='popup-menu'>
      <q-card-section>
        <span>{{ $t('MSG_COUPON_COIN') }}</span>
      </q-card-section>
      <q-card-section>
        <CouponSelector v-model:id='target.CouponID' />
        <AppCoinPicker v-model:id='target.CoinTypeID' />
      </q-card-section>
      <q-item class='row'>
        <LoadingButton loading :label='$t("MSG_SUBMIT")' @click='onSubmit' />
        <q-btn class='btn round' :label='$t("MSG_CANCEL")' @click='onCancel' />
      </q-item>
    </q-card>
  </q-dialog>
</template>

<script setup lang='ts'>
import { computed, defineAsyncComponent, onMounted, ref, watch } from 'vue'
import { couponcoin, sdk, utils } from 'src/npoolstore'
import { useI18n } from 'vue-i18n'
import { AppID } from 'src/api/app'
// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const CouponSelector = defineAsyncComponent(() => import('src/components/inspire/CouponSelector.vue'))
const AppCoinPicker = defineAsyncComponent(() => import('src/components/coin/AppCoinPicker.vue'))
const LoadingButton = defineAsyncComponent(() => import('src/components/button/LoadingButton.vue'))

const _couponcoin = couponcoin.useCouponCoinStore()
const username = ref('')
const couponcoins = computed(() => _couponcoin.couponcoins())
const displayCouponCoins = computed(() => _couponcoin.couponcoins().filter((el) => {
  return el.CoinTypeID?.includes(username.value) ||
             el.CouponID?.includes(username.value)
}))

const target = ref({} as couponcoin.CouponCoin)
const showing = ref(false)

const onCreate = () => {
  target.value = {} as couponcoin.CouponCoin
  showing.value = true
}
const onMenuHide = () => {
  showing.value = false
  target.value = {} as couponcoin.CouponCoin
}
const onCancel = () => {
  onMenuHide()
}

const onSubmit = (done: () => void) => {
  sdk.createCouponCoin(target.value, (error: boolean) => {
    done()
    if (error) {
      return
    }
    onMenuHide()
  })
}

const selectedCouponCoins = ref([] as Array<couponcoin.CouponCoin>)
const onDelete = () => {
  sdk.deleteCouponCoin(selectedCouponCoins.value?.[0], () => {
    // TODO
  })
}

onMounted(() => {
  if (!couponcoins.value?.length) {
    sdk.getCouponCoins(0, 0)
  }
})

watch(AppID, () => {
  if (!couponcoins.value?.length) {
    sdk.getCouponCoins(0, 0)
  }
})

const columns = computed(() => [
  {
    name: 'ID',
    label: t('MSG_ID'),
    sortable: true,
    field: (row: couponcoin.CouponCoin) => row.ID
  },
  {
    name: 'EntID',
    label: t('MSG_ENT_ID'),
    sortable: true,
    field: (row: couponcoin.CouponCoin) => row.EntID
  },
  {
    name: 'CoinTypeID',
    label: t('MSG_COIN_TYPE_ID'),
    sortable: true,
    field: (row: couponcoin.CouponCoin) => row.CoinTypeID
  },
  {
    name: 'CoinName',
    label: t('MSG_COIN_NAME'),
    sortable: true,
    field: (row: couponcoin.CouponCoin) => row.CoinName
  },
  {
    name: 'CoinENV',
    label: t('MSG_COIN_ENV'),
    sortable: true,
    field: (row: couponcoin.CouponCoin) => row.CoinENV
  },
  {
    name: 'CouponID',
    label: t('MSG_COUPON_ID'),
    sortable: true,
    field: (row: couponcoin.CouponCoin) => row.CouponID
  },
  {
    name: 'CouponName',
    label: t('MSG_COUPON_NAME'),
    sortable: true,
    field: (row: couponcoin.CouponCoin) => row.CouponName
  },
  {
    name: 'CouponDenomination',
    label: t('MSG_COUPON_DENOMINATION'),
    sortable: true,
    field: (row: couponcoin.CouponCoin) => row.CouponDenomination
  },
  {
    name: 'CreatedAt',
    label: t('MSG_CREATED_AT'),
    sortable: true,
    field: (row: couponcoin.CouponCoin) => utils.formatTime(row.CreatedAt)
  },
  {
    name: 'UpdatedAt',
    label: t('MSG_UPDATED_AT'),
    sortable: true,
    field: (row: couponcoin.CouponCoin) => utils.formatTime(row.UpdatedAt)
  }
])

</script>
