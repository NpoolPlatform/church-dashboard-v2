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
        <q-input v-model='target.Title' :label='$t("MSG_TITLE")' />
        <q-input v-model='target.Total' :label='$t("MSG_TOTAL")' />
        <q-input v-model='target.Unit' :label='$t("MSG_UNIT")' />
        <q-input v-model='target.UnitPower' :label='$t("MSG_UNIT_POWER")' type='number' min='1' />
        <q-input v-model='target.DurationDays' :label='$t("MSG_DURATION_DAYS")' type='number' />
        <q-input v-model='target.Price' :label='$t("MSG_PRICE")' type='number' min='0' />
        <q-input v-model='deliveryAt' :label='$t("MSG_DELIVERY_AT")' type='date' />
        <q-input v-model='startAt' :label='$t("MSG_START_AT")' type='date' />
      </q-card-section>
      <q-card-section>
        <q-select :options='coins' v-model='selectedCoin' :label='$t("MSG_COIN_TYPE")' />
        <q-select :options='devices' v-model='selectedDevice' :label='$t("MSG_DEVICE_TYPE")' />
        <q-select :options='locations' v-model='selectedLocation' :label='$t("MSG_VENDOR_LOCATION")' />
        <q-select
          multiple
          use-chips
          :options='coins'
          v-model='supportCoins'
          :label='$t("MSG_SUPPORT_COIN_TYPES")'
        />
        <q-select :options='currencies' v-model='selectedCurrency' :label='$t("MSG_PRICE_CURRENCY")' />
        <q-select
          multiple
          use-chips
          :options='fees'
          v-model='selectedFees'
          :label='$t("MSG_FEES")'
        />
        <q-select :options='BenefitTypes' v-model='target.BenefitType' :label='$t("MSG_BENEFIT_TYPE")' />
      </q-card-section>
      <q-card-section>
        <div>
          <q-toggle dense v-model='target.Actuals' :label='$t("MSG_GOOD_ACTUALS")' />
        </div>
        <div>
          <q-toggle dense v-model='target.Classic' :label='$t("MSG_GOOD_CLASSIC")' />
        </div>
        <div>
          <q-toggle dense v-model='target.SeparateFee' :label='$t("MSG_SEPARATE_FEE")' />
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
  DeviceInfo,
  useVendorLocationStore,
  VendorLocation,
  PriceCurrency,
  PriceCoinName,
  useFeeStore,
  useGoodStore,
  Fee,
  BenefitTypes,
  InvalidID,
  formatTime
} from 'npool-cli-v2'
import { computed, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const good = useAdminGoodStore()
const goods = computed(() => buildGoods(good.Goods))

const cgood = useChurchGoodStore()
const fgood = useGoodStore()
const coin = useCoinStore()
const device = useDeviceStore()
const location = useVendorLocationStore()
const fee = useFeeStore()

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

interface MyLocation {
  label: string
  value: VendorLocation
}
const locations = computed(() => Array.from(location.VendorLocations).map((el) => {
  return {
    label: el.Country + ' ' + el.Province + ' ' + el.City + ' ' + el.Address,
    value: el
  } as MyLocation
}))

interface MyPriceCurrency {
  label: string
  value: PriceCurrency
}
const currencies = computed(() => Array.from(cgood.PriceCurrencies.filter((p) => {
  return p.Unit.toLocaleLowerCase().includes(PriceCoinName.toLocaleLowerCase())
}).map((el) => {
  return {
    label: el.Unit,
    value: el
  } as MyPriceCurrency
})))

interface MyFee {
  label: string
  value: Fee
}
const fees = computed(() => Array.from(fee.Fees).map((el) => {
  const feetype = fgood.getFeeTypeByID(el.FeeTypeID)
  if (!feetype) {
    return undefined as unknown as MyFee
  }
  return {
    label: feetype.FeeType + '/' + feetype.PayType + '/' + el.Value.toString(),
    value: el
  } as MyFee
}))

const target = ref({
  SupportCoinTypeIDs: [],
  FeeIDs: [],
  InheritFromGoodID: InvalidID
} as unknown as GoodInfo)

const deliveryAt = ref('')
watch(deliveryAt, () => {
  target.value.DeliveryAt = new Date(deliveryAt.value).getTime() / 1000
})
const startAt = ref('')
watch(startAt, () => {
  target.value.StartAt = new Date(startAt.value).getTime() / 1000
})

const selectedCoin = computed({
  get: () => {
    const myCoin = coin.getCoinByID(target.value.CoinInfoID)
    return {
      label: myCoin?.Name,
      value: myCoin
    } as MyCoin
  },
  set: (val) => {
    target.value.CoinInfoID = val.value.ID as string
  }
})
const supportCoins = computed({
  get: () => {
    const myCoins = [] as Array<MyCoin>
    target.value.SupportCoinTypeIDs.forEach((coinTypeID) => {
      const myCoin = coin.getCoinByID(coinTypeID)
      if (!myCoin) {
        return
      }
      myCoins.push({
        label: myCoin.Name,
        value: myCoin
      } as MyCoin)
    })
    return myCoins
  },
  set: (vals) => {
    target.value.SupportCoinTypeIDs = []
    vals.forEach((val) => {
      target.value.SupportCoinTypeIDs.push(val.value.ID as string)
    })
  }
})
const selectedDevice = computed({
  get: () => {
    const myDevice = device.getDeviceByID(target.value.DeviceInfoID)
    return {
      label: myDevice?.Type,
      value: myDevice
    } as MyDevice
  },
  set: (val) => {
    target.value.DeviceInfoID = val.value.ID as string
  }
})
const selectedLocation = computed({
  get: () => {
    const myLocation = location.getVendorLocationByID(target.value.VendorLocationID)
    if (!myLocation) {
      return undefined as unknown as MyLocation
    }
    return {
      label: myLocation?.Country + ' ' + myLocation?.Province + ' ' + myLocation?.City + ' ' + myLocation?.Address,
      value: myLocation
    } as MyLocation
  },
  set: (val) => {
    target.value.VendorLocationID = val.value.ID as string
  }
})
const selectedCurrency = computed({
  get: () => {
    const myCurrency = cgood.getPriceCurrencyByID(target.value.PriceCurrency)
    return {
      label: myCurrency?.Unit,
      value: myCurrency
    } as MyPriceCurrency
  },
  set: (val) => {
    target.value.PriceCurrency = val.value.ID as string
  }
})
const selectedFees = computed({
  get: () => {
    const myFees = [] as Array<MyFee>
    target.value.FeeIDs.forEach((feeID) => {
      const myFee = fee.getFeeByID(feeID)
      if (!myFee) {
        return
      }

      const feetype = fgood.getFeeTypeByID(myFee.FeeTypeID)
      if (!feetype) {
        return
      }

      myFees.push({
        label: feetype.FeeType + '/' + feetype.PayType + '/' + myFee.Value.toString(),
        value: myFee
      } as MyFee)
    })
    return myFees
  },
  set: (vals) => {
    target.value.FeeIDs = []
    vals.forEach((val) => {
      target.value.FeeIDs.push(val.value.ID as string)
    })
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

  location.getVendorLocations({
    Message: {
      Error: {
        Title: t('MSG_GET_VENDOR_LOCATIONS'),
        Message: t('MSG_GET_VENDOR_LOCATIONS_FAIL'),
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, () => {
    // TODO
  })

  cgood.getPriceCurrencies({
    Message: {
      Error: {
        Title: t('MSG_GET_PRICE_CURRENCIES'),
        Message: t('MSG_GET_PRICE_CURRENCIES_FAIL'),
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, () => {
    // TODO
  })

  fee.getFees({
    Message: {
      Error: {
        Title: t('MSG_GET_FEES'),
        Message: t('MSG_GET_FEES_FAIL'),
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, () => {
    // TODO
  })

  fgood.getFeeTypes({
    Message: {
      Error: {
        Title: t('MSG_GET_FEE_TYPES'),
        Message: t('MSG_GET_FEE_TYPES_FAIL'),
        Popup: true,
        Type: NotificationType.Error
      }
    }
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
  target.value.FeeIDs = Array.from(myGood.Good.Fees).map((el) => el.Fee.ID) as Array<string>

  deliveryAt.value = formatTime(target.value.DeliveryAt, true).replace(/\//g, '-')
  startAt.value = formatTime(target.value.StartAt, true).replace(/\//g, '-')
}

const onSubmit = () => {
  showing.value = false

  if (updating.value) {
    cgood.updateGood({
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
    })
    return
  }

  cgood.createGood({
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
  })
}

const onCancel = () => {
  showing.value = false
}

const onMenuHide = () => {
  showing.value = false
  target.value = {
    SupportCoinTypeIDs: [],
    FeeIDs: [],
    InheritFromGoodID: InvalidID
  } as unknown as GoodInfo
}

</script>

<style lang='sass' scoped>
</style>
