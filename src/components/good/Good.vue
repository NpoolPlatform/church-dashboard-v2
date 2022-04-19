<template>
  <q-table
    dense
    flat
    :title='$t("MSG_GOODS")'
    :rows='goods'
    row-key='ID'
    :rows-per-page-options='[10]'
    @row-click='(evt, row, index) => onRowClick(row as GoodBase)'
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
        <q-select :options='coins' v-model='selectedCoin' :label='$t("MSG_COIN_TYPE")' />
        <q-select :options='devices' v-model='selectedDevice' :label='$t("MSG_DEVICE_TYPE")' />
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
import {
  NotificationType,
  useAdminGoodStore,
  buildGoods,
  GoodBase,
  GoodInfo,
  useChurchGoodStore,
  useCoinStore,
  Coin,
  useDeviceStore,
  DeviceInfo
} from 'npool-cli-v2'
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const good = useAdminGoodStore()
const goods = computed(() => buildGoods(good.Goods))

const cgood = useChurchGoodStore()
const coin = useCoinStore()
const device = useDeviceStore()

interface MyCoin {
  label: string
  value: Coin
}
const coins = computed(() => Array.from(coin.Coins).map((el) => {
  return {
    label: el.Name,
    value: el
  } as MyCoin
}))

interface MyDevice {
  label: string
  value: DeviceInfo
}
const devices = computed(() => Array.from(device.Devices).map((el) => {
  return {
    label: el.Type,
    value: el
  } as MyDevice
}))

const target = ref({} as unknown as GoodInfo)
const selectedCoin = computed({
  get: () => {
    const myCoin = coin.getCoinByID(target.value.CoinInfoID)
    return {
      label: myCoin.Name,
      value: myCoin
    } as MyCoin
  },
  set: (val) => {
    target.value.CoinInfoID = val.value.ID as string
  }
})
const selectedDevice = computed({
  get: () => {
    const myDevice = device.getDeviceByID(target.value.DeviceInfoID)
    return {
      label: myDevice.Type,
      value: myDevice
    } as MyDevice
  },
  set: (val) => {
    target.value.CoinInfoID = val.value.ID as string
  }
})

onMounted(() => {
  good.getAllGoods({
    Message: {
      Error: {
        Title: t('MSG_GET_GOODS'),
        Message: t('MSG_GET_GOODS_FAIL'),
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, () => {
    // TODO
  })

  coin.getCoins({
    Message: {
      Error: {
        Title: t('MSG_GET_COINS'),
        Message: t('MSG_GET_COINS_FAIL'),
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, () => {
    // TODO
  })

  device.getDevices({
    Message: {
      Error: {
        Title: t('MSG_GET_DEVICES'),
        Message: t('MSG_GET_DEVICES_FAIL'),
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, () => {
    // TODO
  })
})

const showing = ref(false)
const updating = ref(false)

const onCreate = () => {
  updating.value = false
  showing.value = true
}

const onRowClick = (lgood: GoodBase) => {
  updating.value = true
  showing.value = true
  target.value = lgood as GoodInfo

  const myGood = good.getGoodByID(lgood.ID as string)
  target.value.VendorLocationID = myGood.Good.VendorLocation.ID as string
  target.value.PriceCurrency = myGood.Good.PriceCurrency.ID as string
  target.value.DeviceInfoID = myGood.Good.DeviceInfo.ID as string
  target.value.CoinInfoID = myGood.Main?.ID as string
  target.value.SupportCoinTypeIDs =
    Array.from(myGood.SupportCoins ? myGood.SupportCoins : []).map((el) => el.ID) as Array<string>
  target.value.FeeIDs = Array.from(myGood.Good.Fees).map((el) => el.ID) as Array<string>
}

const onSubmit = () => {
  showing.value = false

  if (updating.value) {
    cgood.createGood({
      Info: target.value,
      Message: {
        Error: {
          Title: t('MSG_UPDATE_DEVICES'),
          Message: t('MSG_UPDATE_DEVICES_FAIL'),
          Popup: true,
          Type: NotificationType.Error
        }
      }
    }, () => {
      // TODO
    })
    return
  }

  cgood.updateGood({
    Info: target.value,
    Message: {
      Error: {
        Title: t('MSG_UPDATE_GOODS'),
        Message: t('MSG_UPDATE_GOODS_FAIL'),
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

const onMenuHide = () => {
  showing.value = false
  target.value = {} as unknown as GoodInfo
}

</script>
