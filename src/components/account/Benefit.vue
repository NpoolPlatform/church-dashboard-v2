<template>
  <q-table
    dense
    flat
    :rows='gbAccounts'
    row-key='ID'
    :rows-per-page-options='[10]'
    @row-click='(evt, row, index) => onRowClick(row as PlatformAccount)'
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
        <span>{{ $t('MSG_CREATE_APPLICATION') }}</span>
      </q-card-section>
      <q-card-section>
        <!-- <CoinPicker v-model:coin='target.CoinTypeID' />
        <GoodSelector v-model:id='target.GoodID' />
        <q-select :options='goods' v-model='selectedGood' :label='$t("MSG_GOOD")' />
        <q-input
          type='number'
          min='1'
          max='24'
          v-model='target.BenefitIntervalHours'
          :label='$t("MSG_ADDRESS")'
          :suffix='$t("MSG_HOUR")'
        />
      </q-card-section> -->
        <q-item class='row'>
          <q-btn class='btn round alt' :label='$t("MSG_SUBMIT")' @click='onSubmit' />
          <q-btn class='btn round' :label='$t("MSG_CANCEL")' @click='onCancel' />
        </q-item>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang='ts'>
import {
  NotificationType,
  useCoinSettingStore
} from 'npool-cli-v2'
import { PlatformAccount, useChurchGoodBenefitAccountStore, useChurchGoodStore } from 'npool-cli-v4'
import { getGoodBenefitAccounts } from 'src/api/account'
import { getGoods } from 'src/api/good'
import { computed, onMounted, ref } from 'vue'

// const CoinPicker = defineAsyncComponent(() => import('src/components/coin/CoinPicker.vue'))
// const GoodSelector = defineAsyncComponent(() => import('src/components/good/GoodSelector.vue'))

const setting = useCoinSettingStore()

const showing = ref(false)
const updating = ref(false)
const target = ref({} as PlatformAccount)

const onMenuHide = () => {
  showing.value = false
  target.value = {} as PlatformAccount
}

const onCreate = () => {
  showing.value = true
  updating.value = false
}

const onRowClick = (row: PlatformAccount) => {
  target.value = { ...row }
  showing.value = true
  updating.value = true
  // const ac = account.getAccountByID(target.value.BenefitAccountID)
  // selectedCoin.value = {
  //   label: coin.getCoinByID(ac?.CoinTypeID)?.Name as string,
  //   value: coin.getCoinByID(ac?.CoinTypeID)
  // }
}

const onSubmit = () => {
  showing.value = false

  // if (!selectedCoin.value) {
  //   return
  // }

  // if (updating.value) {
  //   setting.updateGoodBenefit({
  //     Info: target.value,
  //     Message: {
  //       Error: {
  //         Title: 'MSG_UPDATE_GOOD_BENEFIT',
  //         Message: 'MSG_UPDATE_GOOD_BENEFIT_FAIL',
  //         Popup: true,
  //         Type: NotificationType.Error
  //       }
  //     }
  //   }, () => {
  //     // TODO
  //   })
  //   return
  // }

  // setting.createGoodBenefit({
  //   Info: target.value,
  //   Message: {
  //     Error: {
  //       Title: 'MSG_CREATE_GOOD_BENEFIT',
  //       Message: 'MSG_CREATE_GOOD_BENEFIT_FAIL',
  //       Popup: true,
  //       Type: NotificationType.Error
  //     }
  //   }
  // }, () => {
  //   // TODO
  // })
}

const onCancel = () => {
  onMenuHide()
}

const gb = useChurchGoodBenefitAccountStore()
const gbAccounts = computed(() => gb.GoodBenefitAccounts.GoodBenefitAccounts)

const good = useChurchGoodStore()
const goods = computed(() => good.Goods.Goods)

onMounted(() => {
  setting.getGCoinSettings({
    Message: {
      Error: {
        Title: 'MSG_GET_COIN_SETTINGS',
        Message: 'MSG_GET_COIN_SETTINGS_FAIL',
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, () => {
    // TODO
  })

  if (goods.value.length === 0) {
    getGoods(0, 500)
  }
  if (gbAccounts.value.length === 0) {
    getGoodBenefitAccounts(0, 500)
  }
})
</script>
