<template>
  <q-table
    dense
    flat
    :rows='coins'
    row-key='ID'
    :title='$t("MSG_COINS")'
    :rows-per-page-options='[10]'
    @row-click='(evt, row, index) => onRowClick(row as Coin)'
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
        <span>{{ $t('MSG_CREATE_COIN') }}</span>
      </q-card-section>
      <q-card-section>
        <q-input v-model='target.Name' :label='$t("MSG_COIN_NAME")' />
        <q-input type='number' v-model='target.ReservedAmount' :label='$t("MSG_COIN_RESERVED_AMOUNT")' />
        <q-input v-model='target.Unit' :label='$t("MSG_COIN_UNIT")' />
        <q-input v-model='target.HomePage' :label='$t("MSG_COIN_HOMEPAGE")' />
        <q-input v-model='target.Logo' :label='$t("MSG_COIN_LOGO")' />
        <q-input v-model='target.Specs' :label='$t("MSG_COIN_SPECS")' />
      </q-card-section>
      <q-card-section>
        <div>
          <q-toggle dense v-model='target.ForPay' :label='$t("MSG_COIN_FOR_PAY")' />
        </div>
        <div>
          <q-toggle dense v-model='target.PreSale' :label='$t("MSG_COIN_PRESALE")' />
        </div>
        <q-select dense :options='CoinEnvironments' v-model='target.ENV' :label='$t("MSG_COIN_ENVIRONMENT")' />
      </q-card-section>
      <q-item class='row'>
        <q-btn class='btn round alt' :label='$t("MSG_SUBMIT")' @click='onSubmit' />
        <q-btn class='btn round' :label='$t("MSG_CANCEL")' @click='onCancel' />
      </q-item>
    </q-card>
  </q-dialog>
</template>

<script setup lang='ts'>
import { useCoinStore, NotificationType, Coin, CoinEnvironments, useChurchCoinStore } from 'npool-cli-v2'
import { computed, onMounted, ref } from 'vue'

const coin = useCoinStore()
const coins = computed(() => coin.Coins)

const ccoin = useChurchCoinStore()

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
})

const showing = ref(false)
const updating = ref(false)
const target = ref({} as unknown as Coin)

const onRowClick = (myCoin: Coin) => {
  target.value = myCoin
  showing.value = true
  updating.value = true
}

const onCreate = () => {
  showing.value = true
  updating.value = false
}

const onMenuHide = () => {
  showing.value = false
  target.value = {} as unknown as Coin
}

const onSubmit = () => {
  showing.value = false

  if (updating.value) {
    ccoin.updateCoin({
      ID: target.value.ID as string,
      PreSale: target.value.PreSale,
      Logo: target.value.Logo,
      ReservedAmount: target.value.ReservedAmount,
      ForPay: target.value.ForPay,
      HomePage: target.value.HomePage,
      Specs: target.value.Specs,
      Name: target.value.Name,
      Unit: target.value.Unit,
      Message: {
        Error: {
          Title: 'MSG_UPDATE_COIN',
          Message: 'MSG_UPDATE_COIN_FAIL',
          Popup: true,
          Type: NotificationType.Error
        }
      }
    }, () => {
      // TODO
    })
    return
  }
  ccoin.createCoin({
    PreSale: target.value.PreSale,
    Logo: target.value.Logo,
    ReservedAmount: target.value.ReservedAmount,
    ForPay: target.value.ForPay,
    Name: target.value.Name,
    Unit: target.value.Unit,
    Message: {
      Error: {
        Title: 'MSG_CREATE_COIN',
        Message: 'MSG_CREATE_COIN_FAIL',
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

</script>
