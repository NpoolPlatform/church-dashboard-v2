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
      <q-card-section v-if='!updating'>
        <CoinPicker v-model:coin='target.CoinTypeID' />
        <q-input v-model='target.Address' :label='$t("MSG_ADDRESS")' />
        <q-select :options='AccountUsedFors' v-model='target.UsedFor' disable :label='$t("MSG_ACCOUNT_USED_FOR")' />
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
      <q-card-section v-if='updating'>
        <div>
          <q-toggle dense v-model='target.Backup' :label='$t("MSG_BACKUP")' />
        </div>
        <div>
          <q-toggle dense v-model='target.Blocked' :label='$t("MSG_BLOCKED")' />
        </div>
        <div>
          <q-toggle dense v-model='target.Active' :label='$t("MSG_ACTIVE")' />
        </div>
        <div>
          <q-toggle dense v-model='target.Locked' :label='$t("MSG_LOCKED")' />
        </div>
      </q-card-section>
      <q-item class='row'>
        <LoadingButton loading :label='$t("MSG_SUBMIT")' @click='onSubmit' />
        <q-btn class='btn round' :label='$t("MSG_CANCEL")' @click='onCancel' />
      </q-item>
    </q-card>
  </q-dialog>
</template>

<script setup lang='ts'>
import { PlatformAccount, useChurchPlatformAccountStore, AccountUsedFors, AccountUsedFor, NotifyType } from 'npool-cli-v4'
import { getPlatformAccounts } from 'src/api/account'
import { computed, defineAsyncComponent, onMounted, ref } from 'vue'

const CoinPicker = defineAsyncComponent(() => import('src/components/coin/CoinPicker.vue'))
const LoadingButton = defineAsyncComponent(() => import('src/components/button/LoadingButton.vue'))

const platform = useChurchPlatformAccountStore()
const platformAccounts = computed(() => platform.PlatformAccounts.PlatformAccounts)

const showing = ref(false)
const updating = ref(false)
const target = ref({ UsedFor: AccountUsedFor.PlatformBenefitCold } as PlatformAccount)

const onMenuHide = () => {
  showing.value = false
  target.value = { UsedFor: AccountUsedFor.PlatformBenefitCold } as PlatformAccount
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

const onCancel = () => {
  onMenuHide()
}

const onSubmit = (done: () => void) => {
  updating.value ? updatePlatformAccount(done) : createPlatformAccount(done)
}

const updateTarget = computed(() => {
  return {
    ID: target.value.ID,
    Backup: target.value.Backup,
    Active: target.value.Active,
    Blocked: target.value.Blocked,
    Locked: target.value.Locked
  }
})

const updatePlatformAccount = (done: () => void) => {
  platform.updatePlatformAccount({
    ...updateTarget.value,
    Message: {
      Error: {
        Title: 'MSG_UPDATE_PLATFORM_ACCOUNT',
        Popup: true,
        Type: NotifyType.Error
      },
      Info: {
        Title: 'MSG_UPDATE_PLATFORM_ACCOUNT',
        Popup: true,
        Type: NotifyType.Success
      }
    }
  }, (account: PlatformAccount, error: boolean) => {
    done()
    if (error) {
      return
    }
    onMenuHide()
  })
}

const createPlatformAccount = (done: () => void) => {
  platform.createPlatformAccount({
    ...target.value,
    Message: {
      Error: {
        Title: 'MSG_CREATE_PLATFORM_ACCOUNT',
        Popup: true,
        Type: NotifyType.Error
      },
      Info: {
        Title: 'MSG_CREATE_PLATFORM_ACCOUNT',
        Popup: true,
        Type: NotifyType.Success
      }
    }
  }, (account: PlatformAccount, error: boolean) => {
    done()
    if (error) {
      return
    }
    onMenuHide()
  })
}

onMounted(() => {
  if (platformAccounts.value.length === 0) {
    getPlatformAccounts(0, 500)
  }
})
</script>
