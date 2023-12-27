<template>
  <q-table
    dense
    flat
    :title='$t("MSG_APP_GOODS")'
    :rows='appGoods'
    row-key='ID'
    :columns='appGoodsColumns'
    :rows-per-page-options='[100]'
    selection='single'
    v-model:selected='selectedGood'
  />
  <!-- q-table
    dense
    flat
    :title='$t("MSG_APP_GOOD_PROMOTIONS")'
    :rows='promotions'
    :columns='columns'
    row-key='ID'
    :rows-per-page-options='[100]'
    @row-click='(evt, row, index) => onRowClick(row as Promotion)'
  >
    <template #top-right>
      <div class='row indent flat'>
        <q-btn
          dense
          flat
          class='btn flat'
          :label='$t("MSG_CREATE")'
          :disable='selectedGood.length === 0'
          @click='onCreate'
        />
      </div>
    </template>
  </q-table -->
  <!-- q-dialog
    v-model='showing'
    @hide='onMenuHide'
    position='right'
  >
    <q-card class='popup-menu'>
      <q-card-section>
        <span>{{ $t('MSG_CREATE_PROMOTION') }}</span>
      </q-card-section>
      <q-card-section>
        <span>{{ updating? target.GoodName : selectedGood[0]?.GoodName }}</span>
      </q-card-section>
      <q-card-section>
        <q-input v-model='target.Message' :label='$t("MSG_MESSAGE")' />
        <q-input type='number' v-model='target.Price' :label='$t("MSG_PRICE")' />
        <DatePicker v-model:date='target.StartAt' :label='$t("MSG_START_AT")' />
        <DatePicker v-model:date='target.EndAt' :label='$t("MSG_END_AT")' />
      </q-card-section>
      <q-item class='row'>
        <LoadingButton loading :label='$t("MSG_SUBMIT")' @click='onSubmit' />
        <q-btn class='btn round' :label='$t("MSG_CANCEL")' @click='onCancel' />
      </q-item>
    </q-card>
  </q-dialog -->
</template>

<script setup lang='ts'>
import { getAppGoods } from 'src/api/good'
import { AppID } from 'src/api/app'
import { computed, /* defineAsyncComponent, */ onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { appgood, utils } from 'src/npoolstore'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

// const DatePicker = defineAsyncComponent(() => import('src/components/date/DatePicker.vue'))
// const LoadingButton = defineAsyncComponent(() => import('src/components/button/LoadingButton.vue'))

const appGood = appgood.useAppGoodStore()
const appGoods = computed(() => appGood.goods(AppID.value))
const selectedGood = ref([] as Array<appgood.Good>)

// const showing = ref(false)
// const updating = ref(false)

/*
const onCreate = () => {
  updating.value = false
  showing.value = true
}

const onRowClick = () => {
  updating.value = true
  showing.value = true
}

const onCancel = () => {
  onMenuHide()
}

const onMenuHide = () => {
  showing.value = false
}

const onSubmit = () => {
  // TODO
}
*/

watch(AppID, () => {
  prepare()
})

onMounted(() => {
  prepare()
})

const prepare = () => {
  if (appGoods.value.length === 0) {
    getAppGoods(0, 500)
  }
}

const appGoodsColumns = computed(() => [
  {
    name: 'ID',
    label: t('MSG_ID'),
    sortable: true,
    field: (row: appgood.Good) => row.ID
  },
  {
    name: 'GOODID',
    label: t('MSG_GOODID'),
    sortable: true,
    field: (row: appgood.Good) => row.GoodID
  },
  {
    name: 'GOODNAME',
    label: t('MSG_GOODNAME'),
    sortable: true,
    field: (row: appgood.Good) => row.GoodName
  },
  {
    name: 'GOODTYPE',
    label: t('MSG_GOOD_TYPE'),
    sortable: true,
    field: (row: appgood.Good) => row.GoodType
  },
  {
    name: 'ONLINE',
    label: t('MSG_ONLINE'),
    sortable: true,
    field: (row: appgood.Good) => row.Online
  },
  {
    name: 'VISIBLE',
    label: t('MSG_VISIBLE'),
    sortable: true,
    field: (row: appgood.Good) => row.Visible
  },
  {
    name: 'GOODPRICE',
    label: t('MSG_GOOD_PRICE'),
    sortable: true,
    field: (row: appgood.Good) => row.UnitPrice
  },
  {
    name: 'GOODUNIT',
    label: t('MSG_GOOD_UNIT'),
    sortable: true,
    field: (row: appgood.Good) => row.QuantityUnit
  },
  {
    name: 'GOODTOTAL',
    label: t('MSG_GOOD_TOTAL'),
    sortable: true,
    field: (row: appgood.Good) => row.GoodTotal
  },
  {
    name: 'GOODLOCKED',
    label: t('MSG_GOOD_LOCKED'),
    sortable: true,
    field: (row: appgood.Good) => row.AppGoodLocked
  },
  {
    name: 'GOODINSERVICE',
    label: t('MSG_GOOD_INSERVICE'),
    sortable: true,
    field: (row: appgood.Good) => row.AppGoodInService
  },
  {
    name: 'COINNAME',
    label: t('MSG_COINNAME'),
    sortable: true,
    field: (row: appgood.Good) => row.CoinName
  },
  {
    name: 'BENEFITTYPE',
    label: t('MSG_BENEFITTYPE'),
    sortable: true,
    field: (row: appgood.Good) => row.BenefitType
  },
  {
    name: 'STARTAT',
    label: t('MSG_STARTAT'),
    sortable: true,
    field: (row: appgood.Good) => utils.formatTime(row.StartAt)
  }
])

</script>
