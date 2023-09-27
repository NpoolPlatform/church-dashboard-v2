<template>
  <q-table
    dense
    flat
    :title='$t("MSG_TOPMOST")'
    :rows='topMosts'
    row-key='ID'
    :columns='columns'
    :rows-per-page-options='[100]'
    @row-click='(evt, row, index) => onRowClick(row as topmost.TopMost)'
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
        <span>{{ $t('MSG_TOPMOST') }}</span>
      </q-card-section>
      <q-card-section>
        <q-input v-model='target.Title' :label='$t("MSG_TITLE")' />
        <q-input v-model='target.Message' :label='$t("MSG_MESSAGE")' />
        <q-input v-model='target.ThresholdCredits' :label='$t("MSG_THRESHOLD_PAYMENT_CREDITS")' />
        <q-input v-model='target.ThresholdPaymentAmount' :label='$t("MSG_THRESHOLD_PAYMENT_AMOUNT")' />
        <q-input v-model.number='target.RegisterElapsedSeconds' :label='$t("MSG_REGISTER_ELAPSED_SECONDS")' />
        <q-input v-model.number='target.ThresholdPurchases' :label='$t("MSG_THRESHOLD_PURCHASES")' />
      </q-card-section>
      <q-card-section>
        <q-select
          label='MSG_POSTERS'
          filled
          v-model='target.Posters'
          use-input
          use-chips
          multiple
          hide-dropdown-icon
          input-debounce='0'
          new-value-mode='add'
        />
      </q-card-section>
      <q-card-section>
        <div> <DateTimePicker v-model:date='target.StartAt' label='MSG_START_AT' /></div>
        <div> <DateTimePicker v-model:date='target.EndAt' label='MSG_END_AT' /></div>
      </q-card-section>
      <q-card-section>
        <div>
          <q-toggle dense v-model='target.KycMust' :label='$t("MSG_KYC_MUST")' />
        </div>
      </q-card-section>
      <q-item class='row'>
        <LoadingButton loading :label='$t("MSG_SUBMIT")' @click='onSubmit' />
        <q-btn class='btn round' :label='$t("MSG_CANCEL")' @click='onCancel' />
      </q-item>
    </q-card>
  </q-dialog>
  <TopMostGood />
</template>

<script setup lang='ts'>
import { computed, defineAsyncComponent, onMounted, ref, watch } from 'vue'
import { topmost, sdk, utils } from 'src/npoolstore'
import { AppID } from 'src/api/app'

const LoadingButton = defineAsyncComponent(() => import('src/components/button/LoadingButton.vue'))
const DateTimePicker = defineAsyncComponent(() => import('src/components/date/DateTimePicker.vue'))
const TopMostGood = defineAsyncComponent(() => import('src/components/good/TopMostGood.vue'))

const topMosts = computed(() => sdk.topMosts.value)
const target = ref({} as topmost.TopMost)

const showing = ref(false)
const updating = ref(false)

const onCreate = () => {
  updating.value = false
  showing.value = true
}

const onRowClick = (row: topmost.TopMost) => {
  updating.value = true
  showing.value = true
  target.value = { ...row }
}

const onMenuHide = () => {
  target.value = {} as topmost.TopMost
  showing.value = false
}

const onCancel = () => {
  showing.value = false
}

const onSubmit = (done: () => void) => {
  if (updating.value) {
    sdk.updateNTopMost(target.value, (error: boolean) => {
      done()
      if (error) return
      onMenuHide()
    })
  } else {
    sdk.createNTopMost(target.value, (error: boolean) => {
      done()
      if (error) return
      onMenuHide()
    })
  }
}

watch(AppID, () => {
  if (!topMosts.value?.length) {
    sdk.getNTopMosts(0, 0)
  }
})

onMounted(() => {
  if (!topMosts.value?.length) {
    sdk.getNTopMosts(0, 0)
  }
})

const columns = computed(() => [
  {
    name: 'ID',
    label: 'MSG_ID',
    sortable: true,
    field: (row: topmost.TopMost) => row.ID
  },
  {
    name: 'AppID',
    label: 'MSG_APP_ID',
    sortable: true,
    field: (row: topmost.TopMost) => row.AppID
  },
  {
    name: 'TopMostType',
    label: 'MSG_TOP_MOST_TYPE',
    sortable: true,
    field: (row: topmost.TopMost) => row.TopMostType
  },
  {
    name: 'Title',
    label: 'MSG_TITLE',
    sortable: true,
    field: (row: topmost.TopMost) => row.Title
  },
  {
    name: 'Message',
    label: 'MSG_MESSAGE',
    sortable: true,
    field: (row: topmost.TopMost) => row.Message
  },
  {
    name: 'StartAt',
    label: 'MSG_START_AT',
    sortable: true,
    field: (row: topmost.TopMost) => utils.formatTime(row.StartAt, undefined)
  },
  {
    name: 'EndAt',
    label: 'MSG_END_AT',
    sortable: true,
    field: (row: topmost.TopMost) => utils.formatTime(row.EndAt, undefined)
  },
  {
    name: 'ThresholdCredits',
    label: 'MSG_CREDIT',
    sortable: true,
    field: (row: topmost.TopMost) => row.ThresholdCredits
  },
  {
    name: 'RegisterElapsedSeconds',
    label: 'MSG_REGISTER_ELAPSED_SECONDS',
    sortable: true,
    field: (row: topmost.TopMost) => row.RegisterElapsedSeconds
  },
  {
    name: 'ThresholdPurchases',
    label: 'MSG_THRESHOLD_PURCHASES',
    sortable: true,
    field: (row: topmost.TopMost) => row.ThresholdPurchases
  },
  {
    name: 'ThresholdPaymentAmount',
    label: 'MSG_PAYMENT_AMOUNT',
    sortable: true,
    field: (row: topmost.TopMost) => row.ThresholdPaymentAmount
  },
  {
    name: 'KycMust',
    label: 'MSG_KYC_MUST',
    sortable: true,
    field: (row: topmost.TopMost) => row.KycMust
  },
  {
    name: 'Posters',
    label: 'MSG_POSTERS',
    sortable: true,
    field: (row: topmost.TopMost) => row.Posters?.join(',')
  },
  {
    name: 'CreatedAt',
    label: 'MSG_CREATED_AT',
    sortable: true,
    field: (row: topmost.TopMost) => utils.formatTime(row.CreatedAt, undefined)
  }
])
</script>
