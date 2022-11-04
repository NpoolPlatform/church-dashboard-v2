<template>
  <q-table
    dense
    flat
    :rows='platformAccounts'
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
        <!-- <q-select :options='coins' v-model='selectedCoin' :label='$t("MSG_COIN_TYPE")' />
        <q-select :options='userAccounts' v-model='selectedIncomingAccount' :label='$t("MSG_GOOD_INCOMING_ACCOUNT")' />
        <q-select :options='userAccounts' v-model='selectedPlatformOfflineAccount' :label='$t("MSG_PLATFORM_OFFLINE_ACCOUNT")' />
        <q-select :options='userAccounts' v-model='selectedUserOfflineAccount' :label='$t("MSG_USER_OFFLINE_ACCOUNT")' />
        <q-select :options='platformAccounts' v-model='selectedUserOnlineAccount' :label='$t("MSG_USER_ONLINE_ACCOUNT")' />
        <q-select :options='platformAccounts' v-model='selectedGasProviderAccount' :label='$t("MSG_GAS_PROVIDER_ACCOUNT")' />
        <q-input
          type='number'
          v-model='target.WarmAccountCoinAmount'
          :label='$t("MSG_WARM_ACCOUNT_COIN_AMOUNT")'
          :suffix='selectedCoin?.value?.Unit'
        />
        <q-input
          type='number'
          v-model='target.PaymentAccountCoinAmount'
          :label='$t("MSG_PAYMENT_ACCOUNT_COIN_AMOUNT")'
          :suffix='selectedCoin?.value?.Unit'
        /> -->
      </q-card-section>
      <q-item class='row'>
        <q-btn class='btn round alt' :label='$t("MSG_SUBMIT")' @click='onSubmit' />
        <q-btn class='btn round' :label='$t("MSG_CANCEL")' @click='onCancel' />
      </q-item>
    </q-card>
  </q-dialog>
</template>

<script setup lang='ts'>
import { PlatformAccount, useChurchPlatformAccountStore } from 'npool-cli-v4/.'
import { getPlatformAccounts } from 'src/api/account'
import { computed, onMounted, ref } from 'vue'

const platform = useChurchPlatformAccountStore()
const platformAccounts = computed(() => platform.PlatformAccounts.PlatformAccounts)

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
}

const onSubmit = () => {
  showing.value = false

  // const accs = new Map<string, number>()
  // accs.set(target.value.GoodIncomingAccountID as string, 1)
  // accs.set(target.value.PlatformOfflineAccountID as string, 1)
  // accs.set(target.value.UserOfflineAccountID as string, 1)
  // accs.set(target.value.UserOnlineAccountID as string, 1)
  // accs.set(target.value.GasProviderAccountID as string, 1)
  // if (accs.size < 5) {
  //   return
  // }

  // if (!selectedCoin.value) {
  //   return
  // }

  // if (updating.value) {
  //   setting.updateCoinSetting({
  //     Info: target.value,
  //     Message: {
  //       Error: {
  //         Title: 'MSG_UPDATE_COIN_SETTING',
  //         Message: 'MSG_UPDATE_COIN_SETTING_FAIL',
  //         Popup: true,
  //         Type: NotificationType.Error
  //       }
  //     }
  //   }, () => {
  //     // TODO
  //   })
  //   return
  // }

  // setting.createCoinSetting({
  //   Info: target.value,
  //   Message: {
  //     Error: {
  //       Title: 'MSG_CREATE_COIN_SETTING',
  //       Message: 'MSG_CREATE_COIN_SETTING_FAIL',
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

onMounted(() => {
  if (platformAccounts.value.length === 0) {
    getPlatformAccounts(0, 500)
  }
})
</script>
