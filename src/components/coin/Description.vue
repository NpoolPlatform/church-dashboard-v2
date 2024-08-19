<template>
  <q-table
    dense
    flat
    :rows='descriptions'
    row-key='ID'
    :title='$t("MSG_COIN_DESCRIPTIONS")'
    :rows-per-page-options='[100]'
  >
    <template #top-right>
      <div class='row indent flat'>
        <q-btn
          dense
          flat
          class='btn flat'
          :label='$t("MSG_CREATE_DESCRIPTION")'
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
        <CoinPicker v-model:coin-type-id='target.CoinTypeID' />
      </q-card-section>
      <q-card-section>
        <q-input v-model='target.Title' :label='$t("MSG_TITLE")' />
        <q-input v-model='target.Message' :label='$t("MSG_MESSAGE")' type='textarea' />
      </q-card-section>
      <q-card-section>
        <q-select dense :options='appcoindescription.CoinDescriptionUsedFors' v-model='target.UsedFor' :label='$t("MSG_USED_FOR")' />
      </q-card-section>
      <q-item class='row'>
        <q-btn class='btn round' :loading='submitting' :label='$t("MSG_SUBMIT")' @click='onSubmit' />
        <q-btn class='btn round' :label='$t("MSG_CANCEL")' @click='onCancel' />
      </q-item>
    </q-card>
  </q-dialog>
</template>

<script setup lang='ts'>
import { computed, onMounted, ref, watch, defineAsyncComponent } from 'vue'
import { appcoindescription, sdk } from 'src/npoolstore'

const AppID = sdk.AppID

const CoinPicker = defineAsyncComponent(() => import('src/components/coin/CoinPicker.vue'))

const description = appcoindescription.useCoinDescriptionStore()
const descriptions = computed(() => description.descriptions(AppID.value))

const showing = ref(false)
const target = ref({} as appcoindescription.CoinDescription)
const submitting = ref(false)

const onCreate = () => {
  showing.value = true
}

const onCancel = () => {
  onMenuHide()
}

const onMenuHide = () => {
  showing.value = false
  target.value = {} as appcoindescription.CoinDescription
}

const onSubmit = () => {
  submitting.value = true
  createCoinDescription()
}

const createCoinDescription = () => {
  sdk.adminCreateAppCoinDescription(target.value, (error: boolean) => {
    submitting.value = false
    if (error) return
    onMenuHide()
  })
}

watch(AppID, () => {
  prepare()
})

onMounted(() => {
  prepare()
})

const prepare = () => {
  if (!descriptions.value?.length) {
    sdk.adminGetAppCoinDescriptions(0, 0)
  }
}

</script>
