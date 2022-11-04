<template>
  <q-table
    dense
    flat
    :title='$t("MSG_COIN_GASES")'
    :rows='gasProviders'
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
        <span>{{ $t('MSG_CREATE_COIN_GAS') }}</span>
      </q-card-section>
      <q-card-section>
        <!-- <q-select :options='coins' v-model='selectedGasCoin' :label='$t("MSG_GAS_COIN_TYPE")' /> -->
      </q-card-section>
      <q-item class='row'>
        <q-btn class='btn round alt' :label='$t("MSG_SUBMIT")' @click='onSubmit' />
        <q-btn class='btn round' :label='$t("MSG_CANCEL")' @click='onCancel' />
      </q-item>
    </q-card>
  </q-dialog>
</template>

<script setup lang='ts'>
import { AccountUsedFor, PlatformAccount, useChurchPlatformAccountStore } from 'npool-cli-v4'
import { getPlatformAccounts } from 'src/api/account'
import { computed, onMounted, ref } from 'vue'

const platform = useChurchPlatformAccountStore()
const gasProviders = computed(() => platform.getAccountsByKey(AccountUsedFor.GasProvider))

const showing = ref(false)
const updating = ref(false)
const target = ref({} as PlatformAccount)

const onCreate = () => {
  showing.value = true
  updating.value = false
  target.value = {} as PlatformAccount
}

const onMenuHide = () => {
  showing.value = false
  updating.value = false
  target.value = {} as PlatformAccount
}

const onRowClick = (gas: PlatformAccount) => {
  showing.value = true
  updating.value = true
  target.value = gas
}

const onCancel = () => {
  onMenuHide()
}

const onSubmit = () => {
  showing.value = false

  // if (updating.value) {
  //   feeder.updatePlatformAccount({
  //     Info: target.value,
  //     Message: {
  //       Error: {
  //         Title: 'MSG_UPDATE_COIN_GAS',
  //         Message: 'MSG_UPDATE_COIN_GAS_FAIL',
  //         Popup: true,
  //         Type: NotificationType.Error
  //       }
  //     }
  //   }, () => {
  //     // TODO
  //   })
  //   return
  // }

  // feeder.createPlatformAccount({
  //   Info: target.value,
  //   Message: {
  //     Error: {
  //       Title: 'MSG_CREATE_COIN_GAS',
  //       Message: 'MSG_CREATE_COIN_GAS_FAIL',
  //       Popup: true,
  //       Type: NotificationType.Error
  //     }
  //   }
  // }, () => {
  //   // TODO
  // })
}

onMounted(() => {
  if (platform.PlatformAccounts.PlatformAccounts.length === 0) {
    getPlatformAccounts(0, 500)
  }
})

</script>
