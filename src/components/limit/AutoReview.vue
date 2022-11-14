<template>
  <q-table
    dense
    flat
    :rows='settings'
    row-key='ID'
    :rows-per-page-options='[10]'
    @row-click='(evt, row, index) => onRowClick(row as WithdrawSetting)'
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
        <span>{{ $t('MSG_CREATE_WITHDRAW_SETTING') }}</span>
      </q-card-section>
      <q-card-section>
        <CoinPicker v-model:coin='target.CoinTypeID' :updating='updating' />
        <!-- <q-select :options='coins' v-model='selectedCoin' :label='$t("MSG_COIN_TYPE")' /> -->
        <q-input
          type='number'
          v-model='target.WithdrawAutoReviewCoinAmount'
          :label='$t("MSG_WITHDRAW_AUTH_REVIEW_AMOUNT")'
          :suffix='targetCoinUnit'
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
import { NotificationType, useChurchWithdrawettingStore, useCoinStore, WithdrawSetting } from 'npool-cli-v2'
import { useLocalApplicationStore } from 'src/localstore'
import { computed, defineAsyncComponent, onMounted, ref } from 'vue'

const CoinPicker = defineAsyncComponent(() => import('src/components/coin/CoinPicker.vue'))

const app = useLocalApplicationStore()
const appID = computed(() => app.AppID)

interface MySetting extends WithdrawSetting {
  CoinName: string
}

const setting = useChurchWithdrawettingStore()
const appSettings = computed(() => setting.WithdrawSettings.get(appID.value) ? setting.WithdrawSettings.get(appID.value) : [])
const settings = computed(() => Array.from(appSettings.value as Array<WithdrawSetting>).map((el) => {
  const ms = el as MySetting
  ms.CoinName = coin.getCoinByID(ms.CoinTypeID)?.Name as string
  return ms
}))

const coin = useCoinStore()
const targetCoinUnit = computed(() => coin.getCoinByID(target.value?.CoinTypeID)?.Unit)

onMounted(() => {
  setting.getWithdrawSettings({
    TargetAppID: appID.value,
    Message: {
      Error: {
        Title: 'MSG_GET_WITHDRAW_SETTINGS',
        Message: 'MSG_GET_WITHDRAW_SETTINGS_FAIL',
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
const target = ref({} as unknown as WithdrawSetting)

const onCreate = () => {
  showing.value = true
  updating.value = false
}

const onRowClick = (s: WithdrawSetting) => {
  showing.value = true
  updating.value = true
  target.value = s
}

const onMenuHide = () => {
  showing.value = false
  target.value = {} as unknown as WithdrawSetting
}

const onSubmit = () => {
  showing.value = false
  if (updating.value) {
    setting.updateWithdrawSetting({
      Info: target.value,
      Message: {
        Error: {
          Title: 'MSG_UPDATE_WITHDRAW_SETTINGS',
          Message: 'MSG_UPDATE_WITHDRAW_SETTINGS_FAIL',
          Popup: true,
          Type: NotificationType.Error
        }
      }
    }, () => {
      // TODO
    })
    return
  }
  setting.createWithdrawSetting({
    TargetAppID: appID.value,
    Info: target.value,
    Message: {
      Error: {
        Title: 'MSG_CREATE_WITHDRAW_SETTINGS',
        Message: 'MSG_CREATE_WITHDRAW_SETTINGS_FAIL',
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
