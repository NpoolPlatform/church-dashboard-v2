<template>
  <q-table
    dense
    flat
    :title='$t("MSG_COMMISSION_COINS")'
    :rows='settings'
    row-key='ID'
    :rows-per-page-options='[10]'
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
        <span>{{ $t('MSG_CREATE_COMMISSION_COIN') }}</span>
      </q-card-section>
      <q-card-section>
        <AppCoinPicker v-model:id='target.CoinTypeID' />
      </q-card-section>
      <q-item class='row'>
        <LoadingButton loading :label='$t("MSG_SUBMIT")' @click='onSubmit' />
        <q-btn class='btn round' :label='$t("MSG_CANCEL")' @click='onCancel' />
      </q-item>
    </q-card>
  </q-dialog>
</template>

<script setup lang='ts'>
import {
  useChurchCommissionStore,
  CommissionCoinSetting,
  NotificationType,
  useCommissionStore
} from 'npool-cli-v2'
import { useChurchAppCoinStore } from 'npool-cli-v4'
import { appID } from 'src/api/app'
import { computed, onMounted, ref, defineAsyncComponent } from 'vue'
import { useI18n } from 'vue-i18n'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const AppCoinPicker = defineAsyncComponent(() => import('src/components/coin/AppCoinPicker.vue'))
const LoadingButton = defineAsyncComponent(() => import('src/components/button/LoadingButton.vue'))

const commission = useChurchCommissionStore()
const acommission = useCommissionStore()

interface MySetting extends CommissionCoinSetting {
  CoinName: string
}

const coin = useChurchAppCoinStore()
const settings = computed(() => Array.from(acommission.CommissionCoinSettings).map((el) => {
  const s = el as MySetting
  s.CoinName = coin.getCoinByID(appID.value, el.CoinTypeID)?.Name as string
  return s
}))

onMounted(() => {
  acommission.getCommissionCoinSettings({
    Message: {
      Error: {
        Title: t('MSG_GET_COMMISSION_COIN_SETTINGS'),
        Message: t('MSG_GET_COMMISSION_COIN_SETTINGS_FAIL'),
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, () => {
    // TODO
  })
})

const showing = ref(false)
const target = ref({} as CommissionCoinSetting)

const onCreate = () => {
  showing.value = true
}

const onMenuHide = () => {
  showing.value = false
  target.value = {
    CoinTypeID: target.value?.CoinTypeID
  } as CommissionCoinSetting
}

const onSubmit = () => {
  showing.value = false

  commission.createCommissionCoinSetting({
    Info: target.value,
    Message: {
      Error: {
        Title: t('MSG_CREATE_COMMISSION_COIN_SETTINGS'),
        Message: t('MSG_CREATE_COMMISSION_COIN_SETTINGS_FAIL'),
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, () => {
    acommission.getCommissionCoinSettings({
      Message: {
        Error: {
          Title: t('MSG_GET_COMMISSION_COIN_SETTINGS'),
          Message: t('MSG_GET_COMMISSION_COIN_SETTINGS_FAIL'),
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
  onMenuHide()
}

</script>
