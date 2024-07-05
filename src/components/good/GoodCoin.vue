<template>
  <q-table
    dense
    flat
    :rows='goodCoins'
    row-key='ID'
    selection='multiple'
    :title='$t("MSG_GOOD_COINS")'
    :rows-per-page-options='[20]'
    v-model:selected='selectedGoodCoins'
    :columns='coinColumns'
    @row-click='(ev, row, index) => onRowClick(row as goodcoin.GoodCoin)'
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
        <q-btn
          dense
          flat
          class='btn flat'
          :label='$t("MSG_DELETE")'
          :disable='(selectedGoodCoins.length === 0)'
          @click='onDelete'
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
        <CoinPicker v-model:coin-type-id='target.CoinTypeID' :updating='updating' label='MSG_COIN_TYPE_ID' :get-data='false' />
        <GoodSelector v-model:good-id='target.GoodID' label='MSG_GOOD_ID' />
      </q-card-section>
      <q-card-section>
        <q-input v-model.number='target.Index' type='number' :label='$t("MSG_DISPLAY_INDEX")' />
      </q-card-section>
      <q-card-section>
        <q-toggle v-model='target.Main' :label='$t("MSG_MAIN")' />
      </q-card-section>
      <q-item class='row'>
        <q-btn class='btn round' :loading='submitting' :label='$t("MSG_SUBMIT")' @click='onSubmit' />
        <q-btn class='btn alt round' :label='$t("MSG_CANCEL")' @click='onCancel' />
      </q-item>
    </q-card>
  </q-dialog>
</template>

<script setup lang='ts'>
import { computed, onMounted, ref, defineAsyncComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import { goodcoin, sdk } from 'src/npoolstore'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const CoinPicker = defineAsyncComponent(() => import('src/components/coin/CoinPicker.vue'))
const GoodSelector = defineAsyncComponent(() => import('src/components/good/GoodSelector.vue'))

const coins = sdk.coins
const goods = sdk.goods
const goodCoins = sdk.goodCoins

const showing = ref(false)
const updating = ref(false)
const submitting = ref(false)
const target = ref({} as goodcoin.GoodCoin)

const onCreate = () => {
  showing.value = true
  updating.value = false
}

const onRowClick = (row: goodcoin.GoodCoin) => {
  target.value = row
  showing.value = true
  updating.value = true
}

const onCancel = () => {
  onMenuHide()
}

const onMenuHide = () => {
  showing.value = false
  submitting.value = false
  target.value = {} as goodcoin.GoodCoin
}

const onSubmit = () => {
  submitting.value = true
  updating.value ? updateAppCoin() : createAppCoin()
}

const updateAppCoin = () => {
  sdk.adminUpdateGoodCoin(target.value, (error: boolean) => {
    submitting.value = false
    if (error) return
    onMenuHide()
  })
}

const createAppCoin = () => {
  sdk.adminCreateGoodCoin(target.value, (error: boolean) => {
    submitting.value = false
    if (error) return
    onMenuHide()
  })
}

const selectedGoodCoins = ref([] as Array<goodcoin.GoodCoin>)
const selectedGoodCoin = computed(() => selectedGoodCoins.value[0])

const onDelete = () => {
  sdk.adminDeleteGoodCoin(selectedGoodCoin.value)
}

onMounted(() => {
  if (!coins.value?.length) {
    sdk.getCoins(0, 0)
  }
  if (!goods.value.length) {
    sdk.getGoods(0, 0)
  }
  if (!goodCoins.value.length) {
    sdk.getGoodCoins(0, 0)
  }
})

const coinColumns = computed(() => [
  {
    name: 'ID',
    label: t('MSG_ID'),
    sortable: true,
    field: (row: goodcoin.GoodCoin) => row.ID
  },
  {
    name: 'EntID',
    label: t('MSG_ENT_ID'),
    sortable: true,
    field: (row: goodcoin.GoodCoin) => row.EntID
  },
  {
    name: 'GoodID',
    label: t('MSG_GOOD_ID'),
    sortable: true,
    field: (row: goodcoin.GoodCoin) => row.GoodID
  },
  {
    name: 'GoodName',
    label: t('MSG_GOOD_NAME'),
    sortable: true,
    field: (row: goodcoin.GoodCoin) => row.GoodName
  },
  {
    name: 'GoodType',
    label: t('MSG_GOOD_TYPE'),
    sortable: true,
    field: (row: goodcoin.GoodCoin) => row.GoodType
  },
  {
    name: 'CoinTypeID',
    label: t('MSG_COIN_TYPE_ID'),
    sortable: true,
    field: (row: goodcoin.GoodCoin) => row.CoinTypeID
  },
  {
    name: 'Name',
    label: t('MSG_APP_COIN_NAME'),
    sortable: true,
    field: (row: goodcoin.GoodCoin) => row.CoinName
  },
  {
    name: 'MainCoin',
    label: t('MSG_MAIN_COIN'),
    sortable: true,
    field: (row: goodcoin.GoodCoin) => row.Main
  }
])
</script>
