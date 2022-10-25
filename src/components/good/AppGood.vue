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
          class='commission-percent' v-model.number='target.CommissionPercent' :label='$t("MSG_COMMISSION_PERCENT")' type='number'
          :min='0'
        >
          <template #append>
            <span>%</span>
          </template>
        </q-input>
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
import {
  useCoinStore
} from 'npool-cli-v2'
import { NotifyType } from 'npool-cli-v4'
import { useLocalApplicationStore } from 'src/localstore'
import { useChurchAppGoodStore } from 'src/teststore/good/appgood'
import { AppGood } from 'src/teststore/good/appgood/types'
import { useChurchGoodStore } from 'src/teststore/good/good'
import { Good } from 'src/teststore/good/good/types'
import { computed, defineAsyncComponent, onMounted, ref, watch } from 'vue'

const LoadingButton = defineAsyncComponent(() => import('src/components/button/LoadingButton.vue'))

const app = useLocalApplicationStore()
const appID = computed(() => app.AppID)

const coin = useCoinStore()
const coins = computed(() => coin.Coins)

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

const onCancel = () => {
  onMenuHide()
}

const onRowClick = (row: AppGood) => {
  target.value = { ...row }
  updating.value = true
  showing.value = true
}

watch(appID, () => {
  prepare()
})

onMounted(() => {
  prepare()
})

const getAppGoods = (offset: number, limit: number) => {
  appGood.getAppGoods({
    Offset: offset,
    Limit: limit,
    TargetAppID: appID.value,
    Message: {
      Error: {
        Title: 'MSG_GET_APP_GOODS',
        Message: 'MSG_GET_APP_GOODS_FAIL',
        Popup: true,
        Type: NotifyType.Error
      }
    }
  }, (goods: Array<AppGood>, error: boolean) => {
    if (error || goods.length < limit) {
      return
    }
    getAppGoods(offset + limit, limit)
  })
}

const prepare = () => {
  if (appGoods.value.length === 0) {
    getAppGoods(0, 500)
  }
}
</script>
<style lang='sass' scoped>
.commission-percent
  ::v-deep .q-field__append
    align-items: flex-end
</style>
