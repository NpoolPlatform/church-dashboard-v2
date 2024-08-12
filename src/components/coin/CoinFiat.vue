<template>
  <q-table
    dense
    flat
    :rows='displayCoins'
    row-key='ID'
    :title='$t("MSG_COINS")'
    selection='multiple'
    v-model:selected='selectedCoins'
    :rows-per-page-options='[20]'
  >
    <template #top-right>
      <div class='row indent flat'>
        <q-input
          dense
          flat
          class='small'
          v-model='name'
          :label='$t("MSG_COIN_NAME")'
        />
      </div>
    </template>
  </q-table>
  <q-table
    dense
    flat
    :rows='displayCoinFiats'
    row-key='ID'
    :title='$t("MSG_COIN_FIATS")'
    :rows-per-page-options='[20]'
  >
    <template #top-right>
      <div class='row indent flat'>
        <q-input
          dense
          flat
          class='small'
          v-model='name1'
          :label='$t("MSG")'
        />
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
        <CoinPicker v-model:coin-type-id='target.CoinTypeID' :updating='updating' label='MSG_COIN_TYPE_ID' />
        <FiatPicker v-model:fiat-id='target.FiatID' label='MSG_FIAT_ID' />
        <q-select :options='chainbase.CurrencyFeedTypes' v-model='target.FeedType' :label='$t("MSG_FEE_TYPE")' />
      </q-card-section>
      <q-item class='row'>
        <LoadingButton loading :label='$t("MSG_SUBMIT")' @click='onSubmit' />
        <q-btn class='btn round' :label='$t("MSG_CANCEL")' @click='onCancel' />
      </q-item>
    </q-card>
  </q-dialog>
</template>

<script setup lang='ts'>
import { computed, onMounted, ref, defineAsyncComponent, watch } from 'vue'
import { coinfiat, notify, coin, sdk, chainbase } from 'src/npoolstore'

const LoadingButton = defineAsyncComponent(() => import('src/components/button/LoadingButton.vue'))
const CoinPicker = defineAsyncComponent(() => import('src/components/coin/CoinPicker.vue'))
const FiatPicker = defineAsyncComponent(() => import('src/components/coin/FiatPicker.vue'))

const _coinFiat = coinfiat.useCoinFiatStore()
const coinFiats = computed(() => _coinFiat.coinfiats())

const name1 = ref('')
const displayCoinFiats = computed(() => {
  return coinFiats.value.filter((el) => {
    return el.CoinName?.toLowerCase()?.includes?.(name1.value?.toLowerCase()) ||
          el.FiatName?.toLowerCase()?.includes(name1.value?.toLowerCase())
  })
})

const showing = ref(false)
const updating = ref(false)
const target = ref({} as coinfiat.CoinFiat)

const onCreate = () => {
  showing.value = true
  updating.value = false
}

const onCancel = () => {
  onMenuHide()
}

const onMenuHide = () => {
  showing.value = false
  target.value = {} as coinfiat.CoinFiat
}

const onSubmit = (done: () => void) => {
  updating.value ? deleteCoinFiat(done) : createCoinFiat(done)
}

const createCoinFiat = (done: () => void) => {
  _coinFiat.createCoinFiat({
    ...target.value,
    Message: {
      Error: {
        Title: 'MSG_CREATE_COIN_FIAT',
        Message: 'MSG_CREATE_COIN_FIAT_FAIL',
        Popup: true,
        Type: notify.NotifyType.Error
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

const deleteCoinFiat = (done: () => void) => {
  _coinFiat.deleteCoinFiat({
    ID: target.value?.ID,
    Message: {
      Error: {
        Title: 'MSG_DELETE_COIN_FIAT',
        Message: 'MSG_DELETE_COIN_FIAT_FAIL',
        Popup: true,
        Type: notify.NotifyType.Error
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

const coins = sdk.coins

const name = ref('')
const displayCoins = computed(() => {
  return coins.value.filter((el) => {
    return el.Name?.toLowerCase()?.includes?.(name.value?.toLowerCase()) ||
          el.EntID?.toLowerCase()?.includes(name.value?.toLowerCase())
  })
})

const selectedCoins = ref([] as Array<coin.Coin>)

const ids = computed(() => {
  const _ids = [] as Array<string>
  selectedCoins.value?.forEach((el) => _ids.push(el.EntID))
  return _ids
})

onMounted(() => {
  if (!coins.value.length) {
    sdk.getCoins(0, 0)
  }
})

watch(ids, () => {
  if (selectedCoins.value?.length > 0) {
    _coinFiat.$reset()
    getCoinFiats(0, 100)
  }
})

const getCoinFiats = (offset: number, limit: number) => {
  _coinFiat.getCoinFiats({
    CoinTypeIDs: ids.value,
    Offset: offset,
    Limit: limit,
    Message: {}
  }, (error: boolean, rows?: coinfiat.CoinFiat[]) => {
    if (error || !rows?.length) {
      return
    }
    getCoinFiats(offset + limit, limit)
  })
}
</script>
