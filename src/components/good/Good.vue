<template>
  <q-table
    dense
    flat
    :title='$t("MSG_GOODS")'
    :rows='goods'
    row-key='ID'
    :rows-per-page-options='[10]'
    @row-click='(evt, row, index) => onRowClick(row as Good)'
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
        <span>{{ $t('MSG_CREATE_GOOD') }}</span>
      </q-card-section>
      <q-card-section>
        <q-input v-model='target.Title' :label='$t("MSG_TITLE")' />
        <q-input v-model='target.Unit' :label='$t("MSG_UNIT")' />
        <q-input v-model='target.UnitAmount' :label='$t("MSG_UNIT_POWER")' type='number' min='1' />
        <q-input v-model='target.DurationDays' :label='$t("MSG_DURATION_DAYS")' type='number' />
        <q-input v-model='target.Price' :label='$t("MSG_PRICE")' type='number' min='0' />
        <q-input v-model='target.DeliveryAt' :label='$t("MSG_DELIVERY_AT")' type='date' />
        <q-input v-model='target.StartAt' :label='$t("MSG_START_AT")' type='date' />
      </q-card-section>
      <q-card-section>
        <CoinPicker v-model:coin='target.CoinTypeID' :updating='updating' />
        <DeviceInfoPicker v-model:device='target.DeviceInfoID' :updating='updating' />
        <VendorLocationPicker v-model:location='target.VendorLocationID' :updating='updating' />
        <!-- <q-select
          multiple
          use-chips
          :options='coins'
          v-model='supportCoins'
          :label='$t("MSG_SUPPORT_COIN_TYPES")'
        /> -->

        <q-select :options='BenefitTypes' v-model='target.BenefitType' :label='$t("MSG_BENEFIT_TYPE")' />
      </q-card-section>
      <q-card-section>
        <div>
          <q-toggle dense v-model='target.Classic' :label='$t("MSG_GOOD_CLASSIC")' />
        </div>
      </q-card-section>
      <q-item class='row'>
        <q-btn class='btn round alt' :label='$t("MSG_SUBMIT")' @click='onSubmit' />
        <q-btn class='btn round' :label='$t("MSG_CANCEL")' @click='onCancel' />
      </q-item>
    </q-card>
  </q-dialog>
  <q-card>
    <q-card-section class='bg-primary text-white'>
      {{ $t('MSG_ADVERTISEMENT_POSITION') }}
    </q-card-section>
  </q-card>
</template>

<script setup lang='ts'>
import { NotifyType } from 'npool-cli-v4'
import { useChurchGoodStore as NewUseChurchGoodStore } from 'src/teststore/good/good'
import { Good } from 'src/teststore/good/good/types'
import { BenefitTypes } from 'src/teststore/good/good/const'
import { computed, defineAsyncComponent, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'

const DeviceInfoPicker = defineAsyncComponent(() => import('src/components/good/DeviceInfoPicker.vue'))
const VendorLocationPicker = defineAsyncComponent(() => import('src/components/good/VendorLocationPicker.vue'))
const CoinPicker = defineAsyncComponent(() => import('src/components/coin/CoinPicker.vue'))
// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const good = NewUseChurchGoodStore()
const goods = computed(() => good.Goods.Goods)
const target = ref({} as Good)

const getGoods = (offset: number, limit: number) => {
  good.getGoods({
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: t('MSG_GET_GOODS'),
        Message: t('MSG_GET_GOODS_FAIL'),
        Popup: true,
        Type: NotifyType.Error
      }
    }
  }, (goods: Array<Good>, error: boolean) => {
    if (error || goods.length < limit) {
      return
    }
    getGoods(offset + limit, limit)
  })
}

onMounted(() => {
  if (good.Goods.Goods.length === 0) {
    getGoods(0, 500)
  }
})

const showing = ref(false)
const updating = ref(false)

const onCreate = () => {
  updating.value = false
  showing.value = true
}

const onRowClick = (lgood: Good) => {
  updating.value = true
  showing.value = true
  console.log(lgood)

  //   const myGood = good.getGoodByID(lgood.ID)
  //   target.value.VendorLocationID = myGood.Good.VendorLocation.ID as string
  //   target.value.PriceCurrency = myGood.Good.PriceCurrency.ID as string
  //   target.value.DeviceInfoID = myGood.Good.DeviceInfo.ID as string
  //   target.value.CoinInfoID = myGood.Main?.ID as string
  //   target.value.SupportCoinTypeIDs =
  //     Array.from(myGood.SupportCoins ? myGood.SupportCoins : []).map((el) => el.ID) as Array<string>
  //   target.value.FeeIDs = Array.from(myGood.Good.Fees).map((el) => el.Fee.ID) as Array<string>

//   deliveryAt.value = formatTime(target.value.DeliveryAt, true).replace(/\//g, '-')
//   startAt.value = formatTime(target.value.StartAt, true).replace(/\//g, '-')
}

const onSubmit = () => {
  showing.value = false

  if (updating.value) {
    // cgood.updateGood({
    //   Info: target.value as,
    //   Message: {
    //     Error: {
    //       Title: t('MSG_UPDATE_GOOD'),
    //       Message: t('MSG_UPDATE_GOOD_FAIL'),
    //       Popup: true,
    //       Type: NotificationType.Error
    //     }
    //   }
    // }, () => {
    //   // TODO
    // })

  }

  // cgood.createGood({
  //   Info: target.value,
  //   Message: {
  //     Error: {
  //       Title: t('MSG_UPDATE_GOODS'),
  //       Message: t('MSG_UPDATE_GOODS_FAIL'),
  //       Popup: true,
  //       Type: NotificationType.Error
  //     }
  //   }
  // }, () => {
  //   // TODO
  // })
}

const onCancel = () => {
  showing.value = false
}

const onMenuHide = () => {
  showing.value = false
  target.value = {} as Good
}
</script>

<style lang='sass' scoped>
</style>
