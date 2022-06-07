<template>
  <q-table
    dense
    flat
    :title='$t("MSG_COIN_GASES")'
    :rows='gases'
    row-key='ID'
    :rows-per-page-options='[10]'
    @row-click='(evt, row, index) => onRowClick(row as CoinGas)'
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
  <q-table
    dense
    flat
    :title='$t("MSG_COIN_GAS_DEPOSITS")'
    :rows='deposits'
    row-key='ID'
    :rows-per-page-options='[10]'
  />
  <q-dialog
    v-model='showing'
    @hide='onMenuHide'
    position='right'
  >
    <q-card class='popup-menu'>
      <q-card-section>
        <span>{{ $t('MSG_CREATE_COIN_GAS') }}</span>
      </q-card-section>
      <q-card-section>
        <q-select :options='coins' v-model='selectedCoin' :label='$t("MSG_COIN_TYPE")' />
        <q-select :options='coins' v-model='selectedGasCoin' :label='$t("MSG_GAS_COIN_TYPE")' />
        <q-input
          type='number'
          v-model='target.DepositThresholdLow'
          :label='$t("MSG_DEPOSIT_THRESHOLD_LOW")'
          :suffix='selectedGasCoin?.value?.Unit'
        />
        <q-input
          type='number'
          v-model='target.DepositAmount'
          :label='$t("MSG_DEPOSIT_AMOUNT")'
          :suffix='selectedGasCoin?.value?.Unit'
        />
      </q-card-section>
      <q-item class='row'>
        <q-btn class='btn round alt' :label='$t("MSG_SUBMIT")' @click='onSubmit' />
        <q-btn class='btn round' :label='$t("MSG_CANCEL")' @click='onCancel' />
      </q-item>
    </q-card>
  </q-dialog>
</template>

<script setup lang='ts'>
import { useCoinStore, NotificationType, useChurchGasFeederStore, Coin, CoinGas } from 'npool-cli-v2'
import { computed, onMounted, ref } from 'vue'

const feeder = useChurchGasFeederStore()
const gases = computed(() => feeder.CoinGases)
const deposits = computed(() => feeder.Deposits)
const coin = useCoinStore()

const showing = ref(false)
const updating = ref(false)
const target = ref({} as unknown as CoinGas)

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
const selectedCoin = computed({
  get: () => {
    return {
      label: coin.getCoinByID(target.value.CoinTypeID)?.Name,
      value: coin.getCoinByID(target.value.CoinTypeID)
    } as MyCoin
  },
  set: (val) => {
    target.value.CoinTypeID = val.value.ID as string
  }
})
const selectedGasCoin = computed({
  get: () => {
    return {
      label: coin.getCoinByID(target.value.GasCoinTypeID)?.Name,
      value: coin.getCoinByID(target.value.GasCoinTypeID)
    } as MyCoin
  },
  set: (val) => {
    target.value.GasCoinTypeID = val.value.ID as string
  }
})

const onCreate = () => {
  showing.value = true
  updating.value = false
  target.value = {} as unknown as CoinGas
}

const onMenuHide = () => {
  showing.value = false
  updating.value = false
  target.value = {} as unknown as CoinGas
}

const onRowClick = (gas: CoinGas) => {
  showing.value = true
  updating.value = true
  target.value = gas
}

const onSubmit = () => {
  showing.value = false

  if (updating.value) {
    feeder.updateCoinGas({
      Info: target.value,
      Message: {
        Error: {
          Title: 'MSG_UPDATE_COIN_GAS',
          Message: 'MSG_UPDATE_COIN_GAS_FAIL',
          Popup: true,
          Type: NotificationType.Error
        }
      }
    }, () => {
      // TODO
    })
    return
  }

  feeder.createCoinGas({
    Info: target.value,
    Message: {
      Error: {
        Title: 'MSG_CREATE_COIN_GAS',
        Message: 'MSG_CREATE_COIN_GAS_FAIL',
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, () => {
    // TODO
  })
}

const onCancel = () => {
  onMenuHide()
}

onMounted(() => {
  coin.getCoins({
    Message: {
      Error: {
        Title: 'MSG_GET_COINS',
        Message: 'MSG_GET_COINS_FAIL',
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, () => {
    // TODO
  })

  feeder.getCoinGases({
    Message: {
      Error: {
        Title: 'MSG_GET_COIN_GASES',
        Message: 'MSG_GET_COIN_GASES_FAIL',
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, () => {
    // TODO
  })

  feeder.getDeposits({
    Message: {
      Error: {
        Title: 'MSG_GET_DEPOSITS',
        Message: 'MSG_GET_DEPOSITS_FAIL',
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, () => {
    // TODO
  })
})

</script>
