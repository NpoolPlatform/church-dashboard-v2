<template>
  <q-table
    dense
    flat
    :title='$t("MSG_GOODS")'
    :rows='displayGoods'
    row-key='ID'
    :rows-per-page-options='[100]'
    selection='single'
    :columns='columns'
    v-model:selected='selectedGood'
  >
    <template #top-right>
      <div class='row indent flat'>
        <q-input
          dense
          flat
          class='small'
          v-model='username'
          :label='$t("MSG_GOOD_NAME")'
        />
        <div v-if='selectedGood.length === 0' class='column justify-center'>
          <span class='warning'>{{ $t('MSG_SELECT_GOOD') }}</span>
        </div>
        <q-btn
          dense
          flat
          class='btn flat'
          :label='$t("MSG_AUTHORIZE")'
          @click='onAuthorizeClick'
          :disable='selectedGood.length === 0'
        />
      </div>
    </template>
  </q-table>
  <q-table
    dense
    flat
    :title='$t("MSG_APP_GOODS")'
    :rows='appGoods'
    :columns='appGoodsColumns'
    row-key='ID'
    selection='single'
    :rows-per-page-options='[100]'
    @row-click='(evt, row, index) => onRowClick(row as appgood.Good)'
  />

  <q-dialog
    v-model='showing'
    @hide='onMenuHide'
    position='right'
  >
    <q-card class='popup-menu'>
      <q-card-section>
        <span>{{ $t('MSG_CREATE_APP_GOOD') }} : {{ updating? target.GoodName : selectedGood[0]?.Title }}</span>
      </q-card-section>
      <q-card-section>
        <q-input v-model='target.Price' :label='$t("MSG_PRICE")' type='number' :min='0' />
        <q-input v-model='target.GoodName' :label='$t("MSG_GOOD_NAME")' :min='0' />
        <q-input v-model.number='target.PurchaseLimit' :label='$t("MSG_PURCHASE_LIMIT")' type='number' :min='0' />
        <q-input
          v-model='target.UserPurchaseLimit'
          :label='$t("MSG_USER_PURCHASE_LIMIT")'
          type='number'
          :min='0'
        />
        <q-input v-model.number='target.DisplayIndex' :label='$t("MSG_DISPLAY_INDEX")' type='number' :min='0' />
        <q-input v-model='target.ProductPage' :label='$t("MSG_PRODUCT_PAGE")' />
        <q-input
          class='commission-percent'
          v-model.number='target.CommissionPercent'
          :label='$t("MSG_COMMISSION_PERCENT")'
          type='number'
          :min='0'
          suffix='%'
        />
        <q-input
          class='commission-percent'
          v-model.number='target.TechnicalFeeRatio'
          :label='$t("MSG_TECHNICALFEE_RATIO")'
          type='number'
          :min='0'
        />
        <q-input
          class='commission-percent'
          v-model.number='target.ElectricityFeeRatio'
          :label='$t("MSG_ELECTRICITYFEE_RATIO")'
          type='number'
          :min='0'
        />
        <q-input
          class='commission-percent'
          v-model='target.DailyRewardAmount'
          :label='$t("MSG_DAILY_REWARD_AMOUNT")'
          type='number'
          :min='0'
        />
      </q-card-section>
      <q-card-section>
        <q-select
          :options='appgood.CancelModes'
          v-model='target.CancelMode'
          :label='$t("MSG_CANCEL_MODE")'
        />
        <q-input
          v-model.number='target.CancellableBeforeStart'
          :label='$t("MSG_CANCELLABLE_BEFORE_START")'
          type='number'
          :min='0'
          suffix='h'
          :disable='appGood.cancelable(AppID, target.ID)'
        />
      </q-card-section>
      <q-card-section>
        <DateTimePicker v-model:date='target.SaleStartAt' label='MSG_SALE_START_AT' />
        <DateTimePicker v-model:date='target.SaleEndAt' label='MSG_SALE_END_AT' />
        <DateTimePicker v-model:date='target.ServiceStartAt' label='MSG_SERVICE_START_AT' />
      </q-card-section>
      <q-card-section>
        <q-toggle dense v-model='target.EnableSetCommission' :label='$t("MSG_ENABLE_SET_COMMISSION")' />
        <q-toggle dense v-model='target.EnablePurchase' :label='$t("MSG_ENABLE_PURCHASE")' />
        <q-toggle dense v-model='target.EnableProductPage' :label='$t("MSG_ENABLE_PRODUCT_PAGE")' />
        <q-toggle dense v-model='target.Visible' :label='$t("MSG_VISIBLE")' />
        <q-toggle dense v-model='target.Online' :label='$t("MSG_ONLINE")' />
      </q-card-section>
      <q-item class='row'>
        <LoadingButton loading :label='$t("MSG_SUBMIT")' @click='onSubmit' />
        <q-btn class='btn round' :label='$t("MSG_CANCEL")' @click='onCancel' />
      </q-item>
    </q-card>
  </q-dialog>
  <AppDefaultGood />
</template>

<script setup lang='ts'>
import { AppID } from 'src/api/app'
import { computed, defineAsyncComponent, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { getAppGoods, getGoods } from 'src/api/good'
import { good, notify, appgood, utils } from 'src/npoolstore'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const LoadingButton = defineAsyncComponent(() => import('src/components/button/LoadingButton.vue'))
const DateTimePicker = defineAsyncComponent(() => import('src/components/date/DateTimePicker.vue'))
const AppDefaultGood = defineAsyncComponent(() => import('src/components/good/AppDefaultGood.vue'))

const _good = good.useGoodStore()
const goods = computed(() => _good.goods())
const selectedGood = ref([] as Array<good.Good>)

const username = ref('')
const displayGoods = computed(() => {
  const name = username.value?.toLowerCase()
  return goods.value?.filter((el) => el.ID.toLowerCase().includes(name) || el.Unit.toLowerCase().includes(name) || el.Title.toLowerCase().includes(name))
})

const appGood = appgood.useAppGoodStore()
const appGoods = computed(() => appGood.goods(AppID.value))

const target = ref({} as appgood.Good)
const showing = ref(false)
const updating = ref(false)

const onMenuHide = () => {
  target.value = {} as appgood.Good
  showing.value = false
}

const onAuthorizeClick = () => {
  showing.value = true
  updating.value = false
}

const onCancel = () => {
  onMenuHide()
}

const onRowClick = (row: appgood.Good) => {
  target.value = { ...row }
  updating.value = true
  showing.value = true
}

const onSubmit = (done: () => void) => {
  updating.value ? updateAppGood(done) : createAppGood(done)
}

const createAppGood = (done: () => void) => {
  appGood.createAppGood({
    TargetAppID: AppID.value,
    ...target.value,
    GoodID: selectedGood.value[0].ID,
    GoodName: selectedGood.value[0].Title,
    UserPurchaseLimit: `${target.value.UserPurchaseLimit}`,
    Message: {
      Error: {
        Title: 'MSG_AUTHORIZE_GOOD',
        Message: 'MSG_AUTHORIZE_GOOD_FAIL',
        Popup: true,
        Type: notify.NotifyType.Error
      },
      Info: {
        Title: 'MSG_AUTHORIZE_GOOD',
        Message: 'MSG_AUTHORIZE_GOOD_SUCCESS',
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

const updateTarget = computed(() => {
  return {
    ID: target.value.ID,
    TargetAppID: target?.value?.AppID,
    Online: target.value.Online,
    Visible: target.value.Visible,
    GoodName: target.value.GoodName,
    Price: target.value.Price,
    DisplayIndex: target.value.DisplayIndex,
    PurchaseLimit: target.value.PurchaseLimit,
    UserPurchaseLimit: `${target.value.UserPurchaseLimit}`,
    CommissionPercent: target.value.CommissionPercent,
    TechnicalFeeRatio: target.value.TechnicalFeeRatio,
    ElectricityFeeRatio: target.value.ElectricityFeeRatio,
    ProductPage: target.value?.ProductPage,
    EnableProductPage: target.value?.EnableProductPage,
    EnablePurchase: target.value?.EnablePurchase,
    EnableSetCommission: target.value?.EnableSetCommission,
    CancelMode: target.value?.CancelMode,
    CancellableBeforeStart: target.value?.CancellableBeforeStart,
    DailyRewardAmount: target.value?.DailyRewardAmount?.length > 0 ? target.value?.DailyRewardAmount : undefined as unknown as string,
    ServiceStartAt: target.value.ServiceStartAt === 0 ? undefined as unknown as number : target.value.ServiceStartAt
  }
})
const updateAppGood = (done: () => void) => {
  appGood.updateNAppGood({
    ...updateTarget.value,
    Message: {
      Error: {
        Title: 'MSG_UPDATE_GOOD',
        Message: 'MSG_UPDATE_GOOD_FAIL',
        Popup: true,
        Type: notify.NotifyType.Error
      },
      Info: {
        Title: 'MSG_UPDATE_GOOD',
        Message: 'MSG_UPDATE_GOOD_SUCCESS',
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

watch(AppID, () => {
  prepare()
})

onMounted(() => {
  prepare()

  if (goods.value.length === 0) {
    getGoods(0, 500)
  }
})

const prepare = () => {
  if (appGoods.value.length === 0) {
    getAppGoods(0, 500)
  }
}

const columns = computed(() => [
  {
    name: 'ID',
    label: t('MSG_ID'),
    sortable: true,
    field: (row: good.Good) => row.ID
  },
  {
    name: 'Title',
    label: t('MSG_GOOD_NAME'),
    sortable: true,
    field: (row: good.Good) => row.Title
  },
  {
    name: 'GOODTYPE',
    label: t('MSG_GOOD_TYPE'),
    sortable: true,
    field: (row: good.Good) => row.GoodType
  },
  {
    name: 'GOODPRICE',
    label: t('MSG_GOOD_PRICE'),
    sortable: true,
    field: (row: good.Good) => row.Price
  },
  {
    name: 'GOODUNIT',
    label: t('MSG_GOOD_UNIT'),
    sortable: true,
    field: (row: good.Good) => t(row.Unit)
  },
  {
    name: 'GOODTOTAL',
    label: t('MSG_GOOD_TOTAL'),
    sortable: true,
    field: (row: good.Good) => row.Total
  },
  {
    name: 'GOODSOLD',
    label: t('MSG_GOOD_SOLD'),
    sortable: true,
    field: (row: good.Good) => row.Sold
  },
  {
    name: 'GOODLOCKED',
    label: t('MSG_GOOD_LOCKED'),
    sortable: true,
    field: (row: good.Good) => row.Locked
  },
  {
    name: 'GOODINSERVICE',
    label: t('MSG_GOOD_INSERVICE'),
    sortable: true,
    field: (row: good.Good) => row.InService
  },
  {
    name: 'WaitStart',
    label: t('MSG_GOOD_WAITSTART'),
    sortable: true,
    field: (row: good.Good) => row.WaitStart
  },
  {
    name: 'COINNAME',
    label: t('MSG_COINNAME'),
    sortable: true,
    field: (row: good.Good) => row.CoinName
  },
  {
    name: 'BENEFITTYPE',
    label: t('MSG_BENEFITTYPE'),
    sortable: true,
    field: (row: good.Good) => row.BenefitType
  },
  {
    name: 'STARTAT',
    label: t('MSG_STARTAT'),
    sortable: true,
    field: (row: good.Good) => utils.formatTime(row.StartAt)
  }
])

const appGoodsColumns = computed(() => [
  {
    name: 'ID',
    label: t('MSG_ID'),
    sortable: true,
    field: (row: appgood.Good) => row.ID
  },
  {
    name: 'GOODID',
    label: t('MSG_GOODID'),
    sortable: true,
    field: (row: appgood.Good) => row.GoodID
  },
  {
    name: 'GOODNAME',
    label: t('MSG_GOODNAME'),
    sortable: true,
    field: (row: appgood.Good) => row.GoodName
  },
  {
    name: 'GOODTYPE',
    label: t('MSG_GOOD_TYPE'),
    sortable: true,
    field: (row: appgood.Good) => row.GoodType
  },
  {
    name: 'ONLINE',
    label: t('MSG_ONLINE'),
    sortable: true,
    field: (row: appgood.Good) => row.Online
  },
  {
    name: 'VISIBLE',
    label: t('MSG_VISIBLE'),
    sortable: true,
    field: (row: appgood.Good) => row.Visible
  },
  {
    name: 'GOODPRICE',
    label: t('MSG_GOOD_PRICE'),
    sortable: true,
    field: (row: appgood.Good) => row.Price
  },
  {
    name: 'GOODUNIT',
    label: t('MSG_GOOD_UNIT'),
    sortable: true,
    field: (row: appgood.Good) => t(row.Unit)
  },
  {
    name: 'GOODTOTAL',
    label: t('MSG_GOOD_TOTAL'),
    sortable: true,
    field: (row: appgood.Good) => row.GoodTotal
  },
  {
    name: 'GOODLOCKED',
    label: t('MSG_GOOD_LOCKED'),
    sortable: true,
    field: (row: appgood.Good) => row.AppGoodLocked
  },
  {
    name: 'GOODINSERVICE',
    label: t('MSG_GOOD_INSERVICE'),
    sortable: true,
    field: (row: appgood.Good) => row.AppGoodInService
  },
  {
    name: 'WaitStart',
    label: t('MSG_GOOD_WAITSTART'),
    sortable: true,
    field: (row: appgood.Good) => row.AppGoodWaitStart
  },
  {
    name: 'COINNAME',
    label: t('MSG_COINNAME'),
    sortable: true,
    field: (row: appgood.Good) => row.CoinName
  },
  {
    name: 'BENEFITTYPE',
    label: t('MSG_BENEFITTYPE'),
    sortable: true,
    field: (row: appgood.Good) => row.BenefitType
  },
  {
    name: 'STARTAT',
    label: t('MSG_STARTAT'),
    sortable: true,
    field: (row: appgood.Good) => utils.formatTime(row.StartAt)
  }
])
</script>
<style lang='sass' scoped>
.commission-percent
  ::v-deep .q-field__append
    align-items: flex-end
</style>
