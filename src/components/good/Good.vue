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
        <q-input v-model.number='target.UnitAmount' :label='$t("MSG_UNIT_POWER")' type='number' :min='1' />
        <q-input v-model.number='target.DurationDays' :label='$t("MSG_DURATION_DAYS")' type='number' />
        <q-input v-model='target.Price' :label='$t("MSG_PRICE")' type='number' :min='0' />
        <DatePicker v-model:date='target.DeliveryAt' :updating='updating' :label='$t("MSG_DELIVERY_AT")' />
        <DatePicker v-model:date='target.StartAt' :updating='updating' :label='$t("MSG_START_AT")' />
      </q-card-section>
      <q-card-section>
        <q-input v-model.number='target.GoodTotal' :label='$t("MSG_GOOD_TOTAL")' type='number' :min='0' />
        <q-input v-model.number='target.GoodSold' :label='$t("MSG_GOOD_SOLD")' type='number' :min='0' />
        <q-input v-model.number='target.GoodInService' :label='$t("MSG_GOOD_INSERVICE")' type='number' :min='0' />
        <q-input v-model.number='target.GoodLocked' :label='$t("MSG_GOOD_LOCKED")' type='number' :min='0' />
      </q-card-section>
      <q-card-section>
        <CoinPicker v-model:coin='target.CoinTypeID' :updating='updating' />
        <CoinMultiPicker v-model:coins='target.SupportCoinTypeIDs' :updating='updating' />
        <DeviceInfoPicker v-model:device='target.DeviceInfoID' :updating='updating' />
        <VendorLocationPicker v-model:location='target.VendorLocationID' :updating='updating' />
      </q-card-section>
      <q-card-section>
        <q-select :options='BenefitTypes' v-model='target.BenefitType' :label='$t("MSG_BENEFIT_TYPE")' />
        <q-select :options='GoodTypes' v-model='target.GoodType' :label='$t("MSG_GOOD_TYPE")' />
      </q-card-section>
      <q-item class='row'>
        <LoadingButton loading :label='$t("MSG_SUBMIT")' @click='onSubmit' />
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
import { useChurchGoodStore } from 'src/teststore/good/good'
import { Good } from 'src/teststore/good/good/types'
import { BenefitTypes, GoodTypes } from 'src/teststore/good/good/const'
import { computed, defineAsyncComponent, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'

const DeviceInfoPicker = defineAsyncComponent(() => import('src/components/good/DeviceInfoPicker.vue'))
const VendorLocationPicker = defineAsyncComponent(() => import('src/components/good/VendorLocationPicker.vue'))
const CoinPicker = defineAsyncComponent(() => import('src/components/coin/CoinPicker.vue'))
const CoinMultiPicker = defineAsyncComponent(() => import('src/components/coin/CoinMultiPicker.vue'))
const LoadingButton = defineAsyncComponent(() => import('src/components/button/LoadingButton.vue'))
const DatePicker = defineAsyncComponent(() => import('src/components/date/DatePicker.vue'))

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const good = useChurchGoodStore()
const goods = computed(() => good.Goods.Goods)
const target = ref({} as Good)

const showing = ref(false)
const updating = ref(false)

const onCreate = () => {
  updating.value = false
  showing.value = true
}

const onRowClick = (row: Good) => {
  target.value = { ...row }
  updating.value = true
  showing.value = true
}

const onSubmit = (done: () => void) => {
  updating.value ? updateGood(done) : createGood(done)
}

const onCancel = () => {
  showing.value = false
}

const onMenuHide = () => {
  showing.value = false
  updating.value = false
  // target.value = {} as Good
}

const createGood = (done: () => void) => {
  good.createGood({
    ...target.value,
    Message: {
      Error: {
        Title: t('MSG_CREATE_GOOD'),
        Message: t('MSG_CREATE_GOOD_FAIL'),
        Popup: true,
        Type: NotifyType.Error
      },
      Info: {
        Title: t('MSG_CREATE_GOOD'),
        Message: t('MSG_CREATE_GOOD_SUCCESS'),
        Popup: true,
        Type: NotifyType.Success
      }
    }
  }, (g: Good, error: boolean) => {
    done()
    if (error) {
      return
    }
    onMenuHide()
  })
}

const updateGood = (done: () => void) => {
  good.updateGood({
    ...target.value,
    Message: {
      Error: {
        Title: t('MSG_UPDATE_GOOD'),
        Message: t('MSG_UPDATE_GOOD_FAIL'),
        Popup: true,
        Type: NotifyType.Error
      },
      Info: {
        Title: t('MSG_UPDATE_GOOD'),
        Message: t('MSG_UPDATE_GOOD_SUCCESS'),
        Popup: true,
        Type: NotifyType.Success
      }
    }
  }, (g: Good, error: boolean) => {
    done()
    if (error) {
      return
    }
    onMenuHide()
  })
}

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
</script>

<style lang='sass' scoped>
</style>
