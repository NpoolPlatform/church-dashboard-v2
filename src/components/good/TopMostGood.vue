<template>
  <q-table
    dense
    flat
    :title='$t("MSG_TOPMOST_GOODS")'
    :rows='topMostGoods'
    row-key='ID'
    :columns='columns'
    :rows-per-page-options='[100]'
    @row-click='(evt, row, index) => onRowClick(row as topmostgood.TopMostGood)'
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
        <span>{{ $t('MSG_TOPMOST_GOOD') }}</span>
      </q-card-section>
      <q-card-section>
        <AppGoodSelector :label='$t("MSG_APP_GOOD")' v-model:id='target.AppGoodID' />
        <TopMostSelector :label='$t("MSG_TOP_MOST")' v-model:id='target.TopMostID' />
      </q-card-section>
      <q-card-section>
        <q-input v-model='target.Price' :label='$t("MSG_PRICE")' />
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
      <q-item class='row'>
        <LoadingButton loading :label='$t("MSG_SUBMIT")' @click='onSubmit' />
        <q-btn class='btn round' :label='$t("MSG_CANCEL")' @click='onCancel' />
      </q-item>
    </q-card>
  </q-dialog>
</template>

<script setup lang='ts'>
import { computed, defineAsyncComponent, onMounted, ref, watch } from 'vue'
import { topmostgood, sdk, utils } from 'src/npoolstore'
import { AppID } from 'src/api/app'

const LoadingButton = defineAsyncComponent(() => import('src/components/button/LoadingButton.vue'))
const AppGoodSelector = defineAsyncComponent(() => import('src/components/good/AppGoodSelector.vue'))
const TopMostSelector = defineAsyncComponent(() => import('src/components/good/TopMostSelector.vue'))

const topMostGoods = computed(() => sdk.topMostGoods.value)
const target = ref({} as topmostgood.TopMostGood)

const showing = ref(false)
const updating = ref(false)

const onCreate = () => {
  updating.value = false
  showing.value = true
}

const onRowClick = (row: topmostgood.TopMostGood) => {
  updating.value = true
  showing.value = true
  target.value = { ...row }
}

const onMenuHide = () => {
  target.value = {} as topmostgood.TopMostGood
  showing.value = false
}

const onCancel = () => {
  showing.value = false
}

const onSubmit = (done: () => void) => {
  if (updating.value) {
    sdk.updateNTopMostGood(target.value, (error: boolean) => {
      done()
      if (error) {
        return
      }
      onMenuHide()
    })
  } else {
    sdk.createNTopMostGood(target.value, (error: boolean) => {
      done()
      if (error) {
        return
      }
      onMenuHide()
    })
  }
}

watch(AppID, () => {
  if (!topMostGoods.value?.length) {
    sdk.getNTopMostGoods(0, 0)
  }
})

onMounted(() => {
  if (!topMostGoods.value?.length) {
    sdk.getNTopMostGoods(0, 0)
  }
})

const columns = computed(() => [
  {
    name: 'ID',
    label: 'MSG_ID',
    sortable: true,
    field: (row: topmostgood.TopMostGood) => row.ID
  },
  {
    name: 'AppID',
    label: 'MSG_APP_ID',
    sortable: true,
    field: (row: topmostgood.TopMostGood) => row.AppID
  },
  {
    name: 'AppGoodID',
    label: 'MSG_APP_GOOD_ID',
    sortable: true,
    field: (row: topmostgood.TopMostGood) => row.AppGoodID
  },
  {
    name: 'AppGoodName',
    label: 'MSG_APP_GOOD_NAME',
    sortable: true,
    field: (row: topmostgood.TopMostGood) => row.AppGoodName
  },
  {
    name: 'CoinTypeID',
    label: 'MSG_CoinTypeID',
    sortable: true,
    field: (row: topmostgood.TopMostGood) => row.CoinTypeID
  },
  {
    name: 'CoinName',
    label: 'MSG_COIN_NAME',
    sortable: true,
    field: (row: topmostgood.TopMostGood) => row.CoinName
  },
  {
    name: 'CoinUnit',
    label: 'MSG_COIN_UNIT',
    sortable: true,
    field: (row: topmostgood.TopMostGood) => row.CoinUnit
  },
  {
    name: 'TopMostID',
    label: 'MSG_TOP_MOST_ID',
    sortable: true,
    field: (row: topmostgood.TopMostGood) => row.TopMostID
  },
  {
    name: 'TopMostTitle',
    label: 'MSG_TOP_MOST_TITLE',
    sortable: true,
    field: (row: topmostgood.TopMostGood) => row.TopMostTitle
  },
  {
    name: 'TopMostType',
    label: 'MSG_TOP_MOST_TYPE',
    sortable: true,
    field: (row: topmostgood.TopMostGood) => row.TopMostType
  },
  {
    name: 'Price',
    label: 'MSG_PRICE',
    sortable: true,
    field: (row: topmostgood.TopMostGood) => row.Price
  },
  {
    name: 'Posters',
    label: 'MSG_POSTERS',
    sortable: true,
    field: (row: topmostgood.TopMostGood) => row.Posters?.join(',')
  },
  {
    name: 'CreatedAt',
    label: 'MSG_CREATED_AT',
    sortable: true,
    field: (row: topmostgood.TopMostGood) => utils.formatTime(row.CreatedAt)
  }
])
</script>
