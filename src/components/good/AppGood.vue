<template>
  <q-table
    dense
    flat
    :title='$t("MSG_APP_GOODS")'
    :rows='appGoods'
    :columns='appGoodsColumns'
    row-key='ID'
    selection='single'
    :rows-per-page-options='[100]'
  />
  <AppDefaultGood />
</template>

<script setup lang='ts'>
import { computed, defineAsyncComponent, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { appgood, utils, sdk } from 'src/npoolstore'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const AppDefaultGood = defineAsyncComponent(() => import('src/components/good/AppDefaultGood.vue'))

const appGoods = sdk.appGoods

onMounted(() => {
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
</script>
<style lang='sass' scoped>
.commission-percent
  ::v-deep .q-field__append
    align-items: flex-end
</style>
