<template>
  <q-table
    dense
    flat
    :title='$t("MSG_MININGPOOL_COINS")'
    :rows='coins'
    :columns='columns'
    row-key='ID'
    :rows-per-page-options='[100]'
    @row-click='(evt, row, index) => onRowClick(row as miningpoolcoin.Coin)'
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
        <span>{{ $t('MSG_MININGPOOL_COIN') }}</span>
      </q-card-section>
      <q-card-section>
        <PoolPicker v-if='!updating' v-model:mining-pool-id='target.PoolID' :label='$t("MSG_POOLID")' />
        <CoinPicker v-if='!updating' v-model:coin-type-id='target.CoinTypeID' :label='$t("MSG_COINTYPEID")' />
        <q-select :options='miningpoolbase.CoinTypes' v-if='!updating' v-model='target.CoinType' :label='$t("MSG_COINTYPE")' />
        <q-select :options='miningpoolbase.RevenueTypes' v-model='target.RevenueType' :label='$t("MSG_REVENUETYPE")' />
        <q-input type='number' v-model='target.FeeRatio' :label='$t("MSG_FEERATIO")' />
        <q-switch v-model='target.FixedRevenueAble' :label='$t("MSG_FIXEDREVENUEABLE")' />
        <q-input type='number' v-model='target.LeastTransferAmount' :label='$t("MSG_LEASTTRANSFERAMOUNT")' />
        <q-input type='number' v-model='target.BenefitIntervalSeconds' :label='$t("MSG_BENEFITINTERVALSECONDS")' />
        <q-input v-model='target.Remark' :label='$t("MSG_REMARK")' />
      </q-card-section>
      <q-item class='row'>
        <LoadingButton loading :label='$t("MSG_SUBMIT")' @click='onSubmit' />
        <q-btn class='btn round' :label='$t("MSG_CANCEL")' @click='onCancel' />
      </q-item>
    </q-card>
  </q-dialog>
</template>

<script setup lang='ts'>
import { computed, onMounted, ref, defineAsyncComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import { miningpoolcoin, miningpoolbase, notify } from 'src/npoolstore'

const PoolPicker = defineAsyncComponent(() => import('src/components/miningpool/PoolPicker.vue'))
const CoinPicker = defineAsyncComponent(() => import('src/components/coin/CoinPicker.vue'))

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const LoadingButton = defineAsyncComponent(() => import('src/components/button/LoadingButton.vue'))

const coinInfo = miningpoolcoin.useMiningpoolCoinStore()
const coins = computed(() => coinInfo.coins())

const target = ref({} as miningpoolcoin.Coin)
const showing = ref(false)
const updating = ref(false)

const onCreate = () => {
  updating.value = false
  showing.value = true
}

const onRowClick = (row: miningpoolcoin.Coin) => {
  updating.value = true
  showing.value = true
  target.value = { ...row }
}

const onSubmit = (done: () => void) => {
  showing.value = false
  updating.value ? updateCoin(done) : createCoin(done)
}

const onCancel = () => {
  showing.value = false
}

const onMenuHide = () => {
  target.value = {} as miningpoolcoin.Coin
  showing.value = false
}

const updateCoin = (done: () => void) => {
  coinInfo.updateCoin({
    ...target.value,
    Message: {
      Error: {
        Title: t('MSG_UPDATE_MININGPOOL'),
        Message: t('MSG_UPDATE_MININGPOOL_FAIL'),
        Popup: true,
        Type: notify.NotifyType.Error
      },
      Info: {
        Title: t('MSG_UPDATE_MININGPOOL'),
        Message: t('MSG_UPDATE_MININGPOOL_SUCCESS'),
        Popup: true,
        Type: notify.NotifyType.Success
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

const createCoin = (done: () => void) => {
  coinInfo.createCoin({
    ...target.value,
    Message: {
      Error: {
        Title: t('MSG_CREATE_MININGPOOL'),
        Message: t('MSG_CREATE_MININGPOOL_FAIL'),
        Popup: true,
        Type: notify.NotifyType.Error
      },
      Info: {
        Title: t('MSG_CREATE_MININGPOOL'),
        Message: t('MSG_CREATE_MININGPOOL_SUCCESS'),
        Popup: true,
        Type: notify.NotifyType.Success
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

const getCoins = (offset: number, limit: number) => {
  coinInfo.getCoins({
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: t('MSG_ADMIN_GET_POOLS'),
        Message: t('MSG_ADMIN_GET_POOL_FAIL'),
        Popup: true,
        Type: notify.NotifyType.Error
      }
    }
  }, (error: boolean, coins?: Array<miningpoolcoin.Coin>) => {
    if (error || !coins?.length) {
      return
    }
    getCoins(offset + limit, limit)
  })
}

onMounted(() => {
  if (!coins.value.length) {
    getCoins(0, 100)
  }
})

const columns = computed(() => [
  {
    name: 'ID',
    label: t('MSG_ID'),
    sortable: true,
    field: (row: miningpoolcoin.Coin) => row.ID
  },
  {
    name: 'ENTID',
    label: t('MSG_ENTID'),
    sortable: true,
    field: (row: miningpoolcoin.Coin) => row.EntID
  },
  {
    name: 'POOLID',
    label: t('MSG_POOLID'),
    sortable: true,
    field: (row: miningpoolcoin.Coin) => row.PoolID
  },
  {
    name: 'COINTYPEID',
    label: t('MSG_COINTYPEID'),
    sortable: true,
    field: (row: miningpoolcoin.Coin) => row.CoinTypeID
  },
  {
    name: 'COINTYPE',
    label: t('MSG_COINTYPE'),
    sortable: true,
    field: (row: miningpoolcoin.Coin) => row.CoinType
  },
  {
    name: 'REVENUETYPE',
    label: t('MSG_REVENUETYPE'),
    sortable: true,
    field: (row: miningpoolcoin.Coin) => row.RevenueType
  },
  {
    name: 'FEERATIO',
    label: t('MSG_FEERATIO'),
    sortable: true,
    field: (row: miningpoolcoin.Coin) => row.FeeRatio
  },
  {
    name: 'FIXEDREVENUEABLE',
    label: t('MSG_FIXEDREVENUEABLE'),
    sortable: true,
    field: (row: miningpoolcoin.Coin) => row.FixedRevenueAble
  },
  {
    name: 'LEASTTRANSFERAMOUNT',
    label: t('MSG_LEASTTRANSFERAMOUNT'),
    sortable: true,
    field: (row: miningpoolcoin.Coin) => row.LeastTransferAmount
  },
  {
    name: 'BENEFITINTERVALSECONDS',
    label: t('MSG_BENEFITINTERVALSECONDS'),
    sortable: true,
    field: (row: miningpoolcoin.Coin) => row.BenefitIntervalSeconds
  },
  {
    name: 'REMARK',
    label: t('MSG_REMARK'),
    sortable: true,
    field: (row: miningpoolcoin.Coin) => row.Remark
  },
  {
    name: 'MININGPOOLTYPE',
    label: t('MSG_MININGPOOLTYPE'),
    sortable: true,
    field: (row: miningpoolcoin.Coin) => row.MiningpoolType
  }
])
</script>
