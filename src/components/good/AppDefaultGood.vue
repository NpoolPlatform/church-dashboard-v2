<template>
  <q-table
    dense
    flat
    :title='$t("MSG_APP_DEFAULT_GOODS")'
    :rows='sdk.defaultGoods.value'
    row-key='ID'
    selection='single'
    :rows-per-page-options='[100]'
    :columns='appDefaultGoodsColumns'
    @row-click='(evt, row, index) => onRowClick(row as appdefaultgood.Default)'
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
        <span>{{ $t('MSG_APP_DEFAULT_GOOD') }}</span>
      </q-card-section>
      <q-card-section>
        <AppGoodSelector v-model:id='target.AppGoodID' />
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
import { useI18n } from 'vue-i18n'
import { AppID } from 'src/api/app'
import { appdefaultgood, utils, sdk } from 'src/npoolstore'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const LoadingButton = defineAsyncComponent(() => import('src/components/button/LoadingButton.vue'))
const AppGoodSelector = defineAsyncComponent(() => import('src/components/good/AppGoodSelector.vue'))

const target = ref({} as appdefaultgood.Default)
const showing = ref(false)
const updating = ref(false)

const onMenuHide = () => {
  target.value = {} as appdefaultgood.Default
  showing.value = false
}

const onCreate = () => {
  showing.value = true
  updating.value = false
}

const onCancel = () => {
  onMenuHide()
}

const onRowClick = (row: appdefaultgood.Default) => {
  target.value = { ...row }
  updating.value = true
  showing.value = true
}

const onSubmit = (done: () => void) => {
  updating.value ? updateAppDefaultGood(done) : createAppDefaultGood(done)
}

const createAppDefaultGood = (done: () => void) => {
  done()
  onMenuHide()
  sdk.createNDefaultGood(target.value)
}

const updateAppDefaultGood = (done: () => void) => {
  done()
  onMenuHide()
  sdk.updateNDefaultGood(target.value)
}

watch(AppID, () => {
  prepare()
})

onMounted(() => {
  prepare()
})

const prepare = () => {
  if (!sdk.defaultGoods.value.length) {
    sdk.getNDefaultGoods(0, 0)
  }
}

const appDefaultGoodsColumns = computed(() => [
  {
    name: 'ID',
    label: t('MSG_ID'),
    sortable: true,
    field: (row: appdefaultgood.Default) => row.ID
  },
  {
    name: 'GoodID',
    label: t('MSG_GOOD_ID'),
    sortable: true,
    field: (row: appdefaultgood.Default) => row.GoodID
  },
  {
    name: 'GoodName',
    label: t('MSG_GOOD_NAME'),
    sortable: true,
    field: (row: appdefaultgood.Default) => row.GoodName
  },
  {
    name: 'GoodID',
    label: t('MSG_APP_GOOD_ID'),
    sortable: true,
    field: (row: appdefaultgood.Default) => row.AppGoodID
  },
  {
    name: 'GoodID',
    label: t('MSG_APP_GOOD_NAME'),
    sortable: true,
    field: (row: appdefaultgood.Default) => row.AppGoodName
  },
  {
    name: 'CoinTypeID',
    label: t('MSG_COIN_TYPE_ID'),
    sortable: true,
    field: (row: appdefaultgood.Default) => row.CoinTypeID
  },
  {
    name: 'CoinUnit',
    label: t('MSG_COIN_UNIT'),
    sortable: true,
    field: (row: appdefaultgood.Default) => row.CoinUnit
  },
  {
    name: 'CreatedAt',
    label: t('MSG_CREATED_AT'),
    sortable: true,
    field: (row: appdefaultgood.Default) => utils.formatTime(row.CreatedAt)
  },
  {
    name: 'UpdatedAt',
    label: t('MSG_UPDATED_AT'),
    sortable: true,
    field: (row: appdefaultgood.Default) => utils.formatTime(row.UpdatedAt)
  }
])
</script>
<style lang='sass' scoped>
</style>
