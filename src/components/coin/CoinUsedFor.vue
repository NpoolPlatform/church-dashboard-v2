<template>
  <q-table
    dense
    flat
    :title='$t("MSG_COIN_USED_FOR")'
    :rows='displayCoinUsedFors'
    row-key='ID'
    :rows-per-page-options='[100]'
    selection='single'
    :columns='columns'
    v-model:selected='selectedCoinUsedFors'
  >
    <template #top-right>
      <div class='row indent flat'>
        <q-input
          dense
          flat
          class='small'
          v-model='username'
          :label='$t("MSG_USERNAME")'
        />
      </div>
      <q-btn
        dense
        flat
        class='btn flat'
        :label='$t("MSG_DELETE")'
        :disable='selectedCoinUsedFors?.length === 0'
        @click='onDelete'
      />
      <q-btn
        dense
        flat
        class='btn flat'
        :label='$t("MSG_CREATE")'
        @click='onCreate'
      />
    </template>
  </q-table>

  <q-dialog
    v-model='showing'
    @hide='onMenuHide'
    position='right'
  >
    <q-card class='popup-menu'>
      <q-card-section>
        <span>{{ $t('MSG_COIN_USED_FOR') }}</span>
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
import { computed, defineAsyncComponent, onMounted, ref, watch } from 'vue'
import { coinusedfor, sdk, utils } from 'src/npoolstore'
import { useI18n } from 'vue-i18n'
import { AppID } from 'src/npoolstore/sdk'
// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const AppCoinPicker = defineAsyncComponent(() => import('src/components/coin/AppCoinPicker.vue'))
const LoadingButton = defineAsyncComponent(() => import('src/components/button/LoadingButton.vue'))

const _coinusedfor = coinusedfor.useCoinUsedForStore()
const username = ref('')
const coinusedfors = computed(() => _coinusedfor.coins())
const displayCoinUsedFors = computed(() => _coinusedfor.coins().filter((el) => {
  return el.CoinTypeID?.includes(username.value) ||
             el.CoinName?.includes(username.value)
}))

const target = ref({} as coinusedfor.CoinUsedFor)
const showing = ref(false)

const onCreate = () => {
  target.value = {} as coinusedfor.CoinUsedFor
  showing.value = true
}
const onMenuHide = () => {
  showing.value = false
  target.value = {} as coinusedfor.CoinUsedFor
}
const onCancel = () => {
  onMenuHide()
}

const onSubmit = (done: () => void) => {
  sdk.createCoinUsedFor(target.value, (error: boolean) => {
    done()
    if (error) {
      return
    }
    onMenuHide()
  })
}

const selectedCoinUsedFors = ref([] as Array<coinusedfor.CoinUsedFor>)
const onDelete = () => {
  sdk.deleteCoinUsedFor(selectedCoinUsedFors.value?.[0], () => {
    // TODO
  })
}

watch(AppID, () => {
  if (!coinusedfors.value?.length) {
    sdk.getCoinUsedFors(0, 0)
  }
})

onMounted(() => {
  if (!coinusedfors.value?.length) {
    sdk.getCoinUsedFors(0, 0)
  }
})

const columns = computed(() => [
  {
    name: 'ID',
    label: t('MSG_ID'),
    sortable: true,
    field: (row: coinusedfor.CoinUsedFor) => row.ID
  },
  {
    name: 'EntID',
    label: t('MSG_ENT_ID'),
    sortable: true,
    field: (row: coinusedfor.CoinUsedFor) => row.EntID
  },
  {
    name: 'UsedFor',
    label: t('MSG_USED_FOR'),
    sortable: true,
    field: (row: coinusedfor.CoinUsedFor) => row.UsedFor
  },
  {
    name: 'CoinTypeID',
    label: t('MSG_COIN_TYPE_ID'),
    sortable: true,
    field: (row: coinusedfor.CoinUsedFor) => row.CoinTypeID
  },
  {
    name: 'CoinName',
    label: t('MSG_COIN_NAME'),
    sortable: true,
    field: (row: coinusedfor.CoinUsedFor) => row.CoinName
  },
  {
    name: 'CoinENV',
    label: t('MSG_COIN_ENV'),
    sortable: true,
    field: (row: coinusedfor.CoinUsedFor) => row.CoinENV
  },
  {
    name: 'CreatedAt',
    label: t('MSG_CREATED_AT'),
    sortable: true,
    field: (row: coinusedfor.CoinUsedFor) => utils.formatTime(row.CreatedAt)
  },
  {
    name: 'UpdatedAt',
    label: t('MSG_UPDATED_AT'),
    sortable: true,
    field: (row: coinusedfor.CoinUsedFor) => utils.formatTime(row.UpdatedAt)
  }
])

</script>
