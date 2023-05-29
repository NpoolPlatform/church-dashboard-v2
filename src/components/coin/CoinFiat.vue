<template>
  <q-table
    dense
    flat
    :rows='displayCoinFiats'
    row-key='ID'
    :title='$t("MSG_COIN_FIATS")'
    :rows-per-page-options='[10]'
  >
    <template #top-right>
      <div class='row indent flat'>
        <q-input
          dense
          flat
          class='small'
          v-model='name'
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
        <CoinPicker v-model:id='target.CoinTypeID' :updating='updating' label='MSG_COIN_TYPE_ID' />
        <FiatPicker v-model:id='target.FiatID' label='MSG_FIAT_ID' />
      </q-card-section>
      <q-item class='row'>
        <LoadingButton loading :label='$t("MSG_SUBMIT")' @click='onSubmit' />
        <q-btn class='btn round' :label='$t("MSG_CANCEL")' @click='onCancel' />
      </q-item>
    </q-card>
  </q-dialog>
  <CoinFiat />
</template>

<script setup lang='ts'>
import { NotifyType } from 'npool-cli-v4'
import { CoinFiat } from 'src/teststore/coin/fiat/types'
import { useCoinFiatStore } from 'src/teststore/coin/fiat'
import { computed, onMounted, ref, defineAsyncComponent } from 'vue'

const LoadingButton = defineAsyncComponent(() => import('src/components/button/LoadingButton.vue'))
const CoinPicker = defineAsyncComponent(() => import('src/components/coin/CoinPicker.vue'))
const FiatPicker = defineAsyncComponent(() => import('src/components/coin/FiatPicker.vue'))

const coinFiat = useCoinFiatStore()
const coinFiats = computed(() => coinFiat.CoinFiats.CoinFiats)

const name = ref('')
const displayCoinFiats = computed(() => {
  return coinFiats.value.filter((el) => el.CoinName?.toLowerCase()?.includes?.(name.value?.toLowerCase()) || el.FiatName?.toLowerCase()?.includes(name.value?.toLowerCase()))
})

const showing = ref(false)
const updating = ref(false)
const target = ref({} as CoinFiat)

const onCreate = () => {
  showing.value = true
  updating.value = false
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const onRowClick = (row: CoinFiat) => {
  target.value = { ...row }
  showing.value = true
  updating.value = true
}

const onCancel = () => {
  onMenuHide()
}

const onMenuHide = () => {
  showing.value = false
  target.value = {} as CoinFiat
}

const onSubmit = (done: () => void) => {
  updating.value ? deleteCoinFiat(done) : createCoinFiat(done)
}

const createCoinFiat = (done: () => void) => {
  coinFiat.createCoinFiat({
    ...target.value,
    Message: {
      Error: {
        Title: 'MSG_CREATE_COIN_CoinFiat',
        Message: 'MSG_CREATE_COIN_CoinFiat_FAIL',
        Popup: true,
        Type: NotifyType.Error
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
  coinFiat.deleteCoinFiat({
    ID: `${target.value?.ID}`,
    Message: {
      Error: {
        Title: 'MSG_DELETE_COIN_FIAT',
        Message: 'MSG_DELETE_COIN_FIAT_FAIL',
        Popup: true,
        Type: NotifyType.Error
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

onMounted(() => {
  if (coinFiat.CoinFiats.CoinFiats.length === 0) {
    getCoinFiats(0, 100)
  }
})

const getCoinFiats = (offset: number, limit: number) => {
  coinFiat.getCoinFiats({
    CoinTypeIDs: [], // TODO
    Offset: offset,
    Limit: limit,
    Message: {}
  }, (error: boolean, rows: CoinFiat[]) => {
    if (error || rows.length === 0) {
      return
    }
    getCoinFiats(offset + limit, limit)
  })
}
</script>
