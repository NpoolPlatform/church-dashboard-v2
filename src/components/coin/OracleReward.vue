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
        <CoinPicker v-model:id='target.CoinTypeID' :updating='updating' />
        <q-input
          type='number'
          v-model='target.DailyReward'
          :suffix='selectedCoin?.Unit'
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
  NotificationType,
  Reward,
  useOracleStore,
  useChurchOracleStore,
  Cond
} from 'npool-cli-v2'
import { useChurchCoinStore } from 'npool-cli-v4'
import { computed, onMounted, ref, defineAsyncComponent } from 'vue'

const CoinPicker = defineAsyncComponent(() => import('src/components/coin/CoinPicker.vue'))

interface MyReward extends Reward {
  CoinName: string
}

const coin = useChurchCoinStore()
const selectedCoin = computed(() => coin.getCoinByID(target.value?.CoinTypeID))

const oracle = useOracleStore()
const coracle = useChurchOracleStore()
const rewards = computed(() => Array.from(oracle.Rewards).map((el) => {
  const r = el as MyReward
  r.CoinName = selectedCoin.value?.Name as string
  return r
}))

const showing = ref(false)
const updating = ref(false)
const target = ref({} as Reward)

const onRowClick = (row: Reward) => {
  target.value = { ...row }
  showing.value = true
  updating.value = true
}

const onCreate = () => {
  showing.value = true
  updating.value = false
}

const onMenuHide = () => {
  showing.value = false
  target.value = {} as Reward
}

const onCancel = () => {
  onMenuHide()
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

onMounted(() => {
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
</script>
