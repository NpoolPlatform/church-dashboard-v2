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
        <q-select :options='coins' v-model='selectedCoin' :label='$t("MSG_COIN_TYPE")' />
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
  useChurchCommissionStore,
  CommissionCoinSetting,
  NotificationType,
  useCommissionStore,
  useCoinStore,
  Coin
} from 'npool-cli-v2'
import { computed, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const commission = useChurchCommissionStore()
const acommission = useCommissionStore()
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
const selectedCoin = ref(undefined as unknown as MyCoin)

interface MySetting extends CommissionCoinSetting {
  CoinName: string
}

const settings = computed(() => Array.from(acommission.CommissionCoinSettings).map((el) => {
  const s = el as MySetting
  s.CoinName = coin.getCoinByID(el.CoinTypeID)?.Name as string
  return s
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
watch(selectedCoin, () => {
  target.value.CoinTypeID = selectedCoin.value?.value.ID as string
})

const onCreate = () => {
  showing.value = true
}

const onMenuHide = () => {
  showing.value = false
  target.value = {
    CoinTypeID: selectedCoin.value?.value.ID
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
