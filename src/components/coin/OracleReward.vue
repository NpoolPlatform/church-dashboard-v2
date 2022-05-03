<template>
  <q-table
    dense
    flat
    :rows='rewards'
    row-key='ID'
    :title='$t("MSG_ORACLE_REWARDS")'
    :rows-per-page-options='[10]'
    @row-click='(evt, row, index) => onRowClick(row as Reward)'
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
        <q-select dense :options='coins' v-model='selectedCoin' :label='$t("MSG_COIN")' />
        <q-input
          type='number'
          v-model='target.DailyReward'
          :suffix='selectedCoin.value?.Unit'
          :label='$t("MSG_ESTIMATED_DAILY_REWARD")'
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
import {
  useCoinStore,
  NotificationType,
  Coin,
  Reward,
  useOracleStore,
  useChurchOracleStore,
  Cond
} from 'npool-cli-v2'
import { computed, onMounted, ref } from 'vue'

const coin = useCoinStore()

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

const oracle = useOracleStore()
const coracle = useChurchOracleStore()

interface MyReward extends Reward {
  CoinName: string
}

const rewards = computed(() => Array.from(oracle.Rewards).map((el) => {
  const r = el as MyReward
  r.CoinName = coin.getCoinByID(el.CoinTypeID)?.Name as string
  return r
}))

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

  oracle.getRewards({
    Conds: new Map<string, Cond>(),
    Message: {
      Error: {
        Title: 'MSG_GET_COIN_ESTIMATED_REWARDS',
        Message: 'MSG_GET_COIN_ESTIMATED_REWARDS_FAIL',
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
const target = ref({} as unknown as Reward)

const selectedCoin = computed({
  get: () => {
    return {
      label: coin.getCoinByID(target.value?.CoinTypeID)?.Name,
      value: coin.getCoinByID(target.value?.CoinTypeID)
    } as MyCoin
  },
  set: (val) => {
    target.value.CoinTypeID = val.value?.ID as string
  }
})

const onRowClick = (myCoin: Reward) => {
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
  target.value = {} as unknown as Reward
}

const onSubmit = () => {
  showing.value = false

  if (updating.value) {
    coracle.updateReward({
      Info: target.value,
      Message: {
        Error: {
          Title: 'MSG_UPDATE_ESTIMATED_REWARD',
          Message: 'MSG_UPDATE_ESTIMATED_REWARD_FAIL',
          Popup: true,
          Type: NotificationType.Error
        }
      }
    }, () => {
      // TODO
    })
    return
  }
  coracle.createReward({
    Info: target.value,
    Message: {
      Error: {
        Title: 'MSG_CREATE_ESTIMATED_REWARD',
        Message: 'MSG_CREATE_ESTIMATED_REWARD_FAIL',
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
