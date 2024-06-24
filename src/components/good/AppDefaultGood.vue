<template>
  <q-table
    dense
    flat
    :title='$t("MSG_APP_GOODS")'
    :rows='appGoods'
    :columns='appGoodsColumns'
    row-key='ID'
    selection='single'
    :rows-per-page-options='[20]'
    v-model:selected='selectedAppGoods'
  />
  <q-table
    dense
    flat
    :title='$t("MSG_APP_DEFAULT_GOODS")'
    :rows='appDefaultGoods'
    row-key='ID'
    selection='single'
    :rows-per-page-options='[20]'
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
          :disable='!selectedAppGoods.length'
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
        <AppGoodSelector v-model:app-good-id='target.AppGoodID' />
      </q-card-section>
      <q-item class='row'>
        <q-btn class='btn round' :loading='submitting' :label='$t("MSG_SUBMIT")' @click='onSubmit' />
        <q-btn class='btn alt round' :label='$t("MSG_CANCEL")' @click='onCancel' />
      </q-item>
    </q-card>
  </q-dialog>
</template>

<script setup lang='ts'>
import { computed, defineAsyncComponent, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { appdefaultgood, utils, sdk, appgood } from 'src/npoolstore'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const AppGoodSelector = defineAsyncComponent(() => import('src/components/good/AppGoodSelector.vue'))

const appGoods = sdk.appGoods
const appDefaultGoods = sdk.appDefaultGoods
const selectedAppGoods = ref([] as appgood.Good[])
const selectedAppGood = computed(() => selectedAppGoods.value[0])

const target = ref({} as appdefaultgood.Default)
const showing = ref(false)
const updating = ref(false)
const submitting = ref(false)

watch(() => selectedAppGood.value?.EntID, () => {
  target.value.AppGoodID = selectedAppGood.value?.EntID
})

const onMenuHide = () => {
  target.value = {} as appdefaultgood.Default
  showing.value = false
}

const onCreate = () => {
  showing.value = true
  updating.value = false
  submitting.value = false
}

const onCancel = () => {
  onMenuHide()
}

const onRowClick = (row: appdefaultgood.Default) => {
  target.value = { ...row }
  updating.value = true
  showing.value = true
}

const onSubmit = () => {
  submitting.value = true
  updating.value ? updateAppDefaultGood() : createAppDefaultGood()
}

const createAppDefaultGood = () => {
  sdk.adminCreateAppDefaultGood(target.value, (error: boolean) => {
    if (error) return
    onMenuHide()
  })
}

const updateAppDefaultGood = () => {
  sdk.adminUpdateAppDefaultGood(target.value, (error: boolean) => {
    if (error) return
    onMenuHide()
  })
}

watch(sdk.AppID, () => {
  if (!appDefaultGoods.value.length) {
    sdk.adminGetAppDefaultGoods(0, 0)
  }
  if (!appGoods.value.length) {
    sdk.adminGetAppGoods(0, 0)
  }
})

onMounted(() => {
  if (!appDefaultGoods.value.length) {
    sdk.adminGetAppDefaultGoods(0, 0)
  }
  if (!appGoods.value.length) {
    sdk.adminGetAppGoods(0, 0)
  }
})

const appGoodsColumns = computed(() => [
  {
    name: 'ID',
    label: t('MSG_ID'),
    sortable: true,
    field: (row: appgood.Good) => row.ID
  },
  {
    name: 'EntID',
    label: t('MSG_ENT_ID'),
    sortable: true,
    field: (row: appgood.Good) => row.EntID
  },
  {
    name: 'GoodID',
    label: t('MSG_GOODID'),
    sortable: true,
    field: (row: appgood.Good) => row.GoodID
  },
  {
    name: 'GoodName',
    label: t('MSG_GOODNAME'),
    sortable: true,
    field: (row: appgood.Good) => row.GoodName
  },
  {
    name: 'GoodType',
    label: t('MSG_GOOD_TYPE'),
    sortable: true,
    field: (row: appgood.Good) => row.GoodType
  },
  {
    name: 'Online',
    label: t('MSG_ONLINE'),
    sortable: true,
    field: (row: appgood.Good) => row.GoodOnline && row.AppGoodOnline
  },
  {
    name: 'Visible',
    label: t('MSG_VISIBLE'),
    sortable: true,
    field: (row: appgood.Good) => row.Visible
  },
  {
    name: 'BenefitType',
    label: t('MSG_BENEFIT_TYPE'),
    sortable: true,
    field: (row: appgood.Good) => row.BenefitType
  },
  {
    name: 'StartAt',
    label: t('MSG_START_AT'),
    sortable: true,
    field: (row: appgood.Good) => utils.formatTime(row.ServiceStartAt)
  }
])

const appDefaultGoodsColumns = computed(() => [
  {
    name: 'ID',
    label: t('MSG_ID'),
    sortable: true,
    field: (row: appdefaultgood.Default) => row.ID
  },
  {
    name: 'EntID',
    label: t('MSG_ENT_ID'),
    sortable: true,
    field: (row: appdefaultgood.Default) => row.EntID
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
