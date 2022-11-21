<template>
  <q-table
    dense
    flat
    :title='$t("MSG_COINS")'
    :rows='coins'
    row-key='ID'
    :rows-per-page-options='[10]'
  />
  <q-table
    dense
    flat
    :title='$t("MSG_GOODS")'
    :rows='goods'
    row-key='ID'
    :rows-per-page-options='[10]'
    selection='single'
    :columns='columns'
    v-model:selected='selectedGood'
  >
    <template #top-right>
      <div class='row indent flat'>
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
    :rows-per-page-options='[10]'
    @row-click='(evt, row, index) => onRowClick(row as AppGood)'
  />
  <q-card>
    <q-card-section class='bg-primary text-white'>
      {{ $t('MSG_ADVERTISEMENT_POSITION') }}
    </q-card-section>
  </q-card>
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
        <q-input v-model.number='target.PurchaseLimit' :label='$t("MSG_PURCHASE_LIMIT")' type='number' :min='0' />
        <q-input v-model.number='target.DisplayIndex' :label='$t("MSG_DISPLAY_INDEX")' type='number' :min='0' />
        <q-input
          class='commission-percent'
          v-model.number='target.CommissionPercent'
          :label='$t("MSG_COMMISSION_PERCENT")'
          type='number'
          :min='0'
          suffix='%'
        />
      </q-card-section>
      <q-card-section>
        <div>
          <q-toggle dense v-model='target.Visible' :label='$t("MSG_VISIBLE")' />
        </div>
        <div>
          <q-toggle dense v-model='target.Online' :label='$t("MSG_ONLINE")' />
        </div>
      </q-card-section>
      <q-item class='row'>
        <LoadingButton loading :label='$t("MSG_SUBMIT")' @click='onSubmit' />
        <q-btn class='btn round' :label='$t("MSG_CANCEL")' @click='onCancel' />
      </q-item>
    </q-card>
  </q-dialog>
</template>

<script setup lang='ts'>
import { useLocalApplicationStore } from 'src/localstore'
import { Good, NotifyType, useChurchGoodStore, useChurchAppGoodStore, AppGood, formatTime, useChurchAppCoinStore } from 'npool-cli-v4'
import { computed, defineAsyncComponent, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { getAppGoods, getGoods } from 'src/api/good'
import { getCoins } from 'src/api/coin'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const LoadingButton = defineAsyncComponent(() => import('src/components/button/LoadingButton.vue'))

const app = useLocalApplicationStore()
const appID = computed(() => app.AppID)

const coin = useChurchAppCoinStore()
const coins = computed(() => coin.getCoinsByAppID(appID.value))

const good = useChurchGoodStore()
const goods = computed(() => good.Goods.Goods)
const selectedGood = ref([] as Array<Good>)

const appGood = useChurchAppGoodStore()
const appGoods = computed(() => appGood.getGoodsByAppID(appID.value))

const target = ref({} as AppGood)
const showing = ref(false)
const updating = ref(false)

const onMenuHide = () => {
  target.value = {} as AppGood
  showing.value = false
}

const onAuthorizeClick = () => {
  showing.value = true
  updating.value = false
}

const onCancel = () => {
  onMenuHide()
}

const onRowClick = (row: AppGood) => {
  target.value = { ...row }
  updating.value = true
  showing.value = true
}

const onSubmit = (done: () => void) => {
  updating.value ? updateAppGood(done) : createAppGood(done)
}

const createAppGood = (done: () => void) => {
  appGood.createAppGood({
    TargetAppID: appID.value,
    ...target.value,
    GoodID: selectedGood.value[0].ID,
    GoodName: selectedGood.value[0].Title,
    Message: {
      Error: {
        Title: 'MSG_AUTHORIZE_GOOD',
        Message: 'MSG_AUTHORIZE_GOOD_FAIL',
        Popup: true,
        Type: NotifyType.Error
      },
      Info: {
        Title: 'MSG_AUTHORIZE_GOOD',
        Message: 'MSG_AUTHORIZE_GOOD_SUCCESS',
        Popup: true,
        Type: NotifyType.Success
      }
    }
  }, (g: AppGood, error: boolean) => {
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
    TargetAppID: appID.value,
    Online: target.value.Online,
    Visible: target.value.Visible,
    GoodName: target.value.GoodName,
    Price: target.value.Price,
    DisplayIndex: target.value.DisplayIndex,
    PurchaseLimit: target.value.PurchaseLimit,
    CommissionPercent: target.value.CommissionPercent
  }
})
const updateAppGood = (done: () => void) => {
  appGood.updateAppGood({
    ...updateTarget.value,
    Message: {
      Error: {
        Title: 'MSG_AUTHORIZE_GOOD',
        Message: 'MSG_AUTHORIZE_GOOD_FAIL',
        Popup: true,
        Type: NotifyType.Error
      },
      Info: {
        Title: 'MSG_AUTHORIZE_GOOD',
        Message: 'MSG_AUTHORIZE_GOOD_SUCCESS',
        Popup: true,
        Type: NotifyType.Success
      }
    }
  }, (g: AppGood, error: boolean) => {
    done()
    if (error) {
      return
    }
    onMenuHide()
  })
}

watch(appID, () => {
  prepare()
})

onMounted(() => {
  prepare()

  if (goods.value.length === 0) {
    getGoods(0, 500)
  }
  if (coins.value.length === 0) {
    getCoins(0, 500)
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
    field: (row: Good) => row.ID
  },
  {
    name: 'GOODTYPE',
    label: t('MSG_GOOD_TYPE'),
    field: (row: Good) => row.GoodType
  },
  {
    name: 'GOODPRICE',
    label: t('MSG_GOOD_PRICE'),
    field: (row: Good) => row.Price
  },
  {
    name: 'GOODUNIT',
    label: t('MSG_GOOD_UNIT'),
    field: (row: Good) => row.Unit
  },
  {
    name: 'GOODTOTAL',
    label: t('MSG_GOOD_TOTAL'),
    field: (row: Good) => row.Total
  },
  {
    name: 'GOODSOLD',
    label: t('MSG_GOOD_SOLD'),
    field: (row: Good) => row.Sold
  },
  {
    name: 'GOODLOCKED',
    label: t('MSG_GOOD_LOCKED'),
    field: (row: Good) => row.Locked
  },
  {
    name: 'GOODINSERVICE',
    label: t('MSG_GOOD_INSERVICE'),
    field: (row: Good) => row.InService
  },
  {
    name: 'COINNAME',
    label: t('MSG_COINNAME'),
    field: (row: Good) => row.CoinName
  },
  {
    name: 'BENEFITTYPE',
    label: t('MSG_BENEFITTYPE'),
    field: (row: Good) => row.BenefitType
  },
  {
    name: 'STARTAT',
    label: t('MSG_STARTAT'),
    field: (row: Good) => formatTime(row.StartAt)
  }
])

const appGoodsColumns = computed(() => [
  {
    name: 'ID',
    label: t('MSG_ID'),
    field: (row: AppGood) => row.ID
  },
  {
    name: 'GOODID',
    label: t('MSG_GOODID'),
    field: (row: AppGood) => row.GoodID
  },
  {
    name: 'GOODNAME',
    label: t('MSG_GOODNAME'),
    field: (row: AppGood) => row.GoodName
  },
  {
    name: 'GOODTYPE',
    label: t('MSG_GOOD_TYPE'),
    field: (row: AppGood) => row.GoodType
  },
  {
    name: 'ONLINE',
    label: t('MSG_ONLINE'),
    field: (row: AppGood) => row.Online
  },
  {
    name: 'VISIBLE',
    label: t('MSG_VISIBLE'),
    field: (row: AppGood) => row.Visible
  },
  {
    name: 'GOODPRICE',
    label: t('MSG_GOOD_PRICE'),
    field: (row: AppGood) => row.Price
  },
  {
    name: 'GOODUNIT',
    label: t('MSG_GOOD_UNIT'),
    field: (row: AppGood) => row.Unit
  },
  {
    name: 'GOODTOTAL',
    label: t('MSG_GOOD_TOTAL'),
    field: (row: AppGood) => row.Total
  },
  {
    name: 'GOODSOLD',
    label: t('MSG_GOOD_SOLD'),
    field: (row: AppGood) => row.Sold
  },
  {
    name: 'GOODLOCKED',
    label: t('MSG_GOOD_LOCKED'),
    field: (row: AppGood) => row.Locked
  },
  {
    name: 'GOODINSERVICE',
    label: t('MSG_GOOD_INSERVICE'),
    field: (row: AppGood) => row.InService
  },
  {
    name: 'COINNAME',
    label: t('MSG_COINNAME'),
    field: (row: AppGood) => row.CoinName
  },
  {
    name: 'BENEFITTYPE',
    label: t('MSG_BENEFITTYPE'),
    field: (row: AppGood) => row.BenefitType
  },
  {
    name: 'STARTAT',
    label: t('MSG_STARTAT'),
    field: (row: AppGood) => formatTime(row.StartAt)
  }
])
</script>
<style lang='sass' scoped>
.commission-percent
  ::v-deep .q-field__append
    align-items: flex-end
</style>
