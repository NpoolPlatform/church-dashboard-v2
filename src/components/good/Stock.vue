<template>
  <q-table
    dense
    flat
    :title='$t("MSG_STOCKS")'
    :rows='stocks'
    row-key='ID'
    :rows-per-page-options='[10]'
    @row-click='(evt, row, index) => onRowClick(row as Stock)'
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
        <span>{{ $t('MSG_CREATE_RECOMMEND') }}</span>
      </q-card-section>
      <q-card-section>
        <q-select :options='goods' v-model='selectedGood' :label='$t("MSG_GOOD")' />
      </q-card-section>
      <q-card-section>
        <q-input type='number' v-model='target.Total' :label='$t("MSG_TOTAL")' :suffix='goodUnit' />
      </q-card-section>
      <q-item class='row'>
        <q-btn class='btn round alt' :label='$t("MSG_SUBMIT")' @click='onSubmit' />
        <q-btn class='btn round' :label='$t("MSG_CANCEL")' @click='onCancel' />
      </q-item>
    </q-card>
  </q-dialog>
  <q-card>
    <q-card-section class='bg-primary text-white'>
      {{ $t('MSG_ADVERTISEMENT_POSITION') }}
    </q-card-section>
  </q-card>
</template>

<script setup lang='ts'>
import {
  Good,
  NotificationType,
  Stock,
  useAdminGoodStore,
  useChurchStockStore,
  useStockStore
} from 'npool-cli-v2'
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const adminGood = useAdminGoodStore()
const stock = useStockStore()
const cstock = useChurchStockStore()

interface MyStock extends Stock {
  GoodName: string
}

const stocks = computed(() => Array.from(stock.Stocks).map((el) => {
  const s = el as MyStock
  s.GoodName = adminGood.getGoodByID(el.GoodID)?.Good.Good.Title
  return s
}))

interface MyGood {
  label: string
  value: Good
}
const goods = computed(() => Array.from(adminGood.Goods.filter((good) => {
  return stock.Stocks.findIndex((el) => el.GoodID === good.Good.Good.ID) < 0
})).map((el) => {
  return {
    label: el.Good.Good.Title,
    value: el
  } as MyGood
}))
const selectedGood = computed({
  get: () => {
    return {
      label: adminGood.getGoodByID(target.value.GoodID)?.Good.Good.Title,
      value: adminGood.getGoodByID(target.value.GoodID)
    } as MyGood
  },
  set: (val) => {
    target.value.GoodID = val.value.Good.Good.ID as string
  }
})
const goodUnit = computed(() => {
  return selectedGood.value?.value?.Good.Good.UnitPower.toString() + ' ' + selectedGood.value?.value?.Good.Good.Unit
})

onMounted(() => {
  adminGood.getAllGoods({
    Message: {
      Error: {
        Title: t('MSG_GET_GOODS'),
        Message: t('MSG_GET_GOODS_FAIL'),
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, () => {
    // TODO
  })

  stock.getStocks({
    Message: {
      Error: {
        Title: t('MSG_GET_STOCKS'),
        Message: t('MSG_GET_STOCKS_FAIL'),
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, () => {
    // TODO
  })
})

const showing = ref(false)
const updating = ref(false)
const target = ref({} as unknown as Stock)

const onMenuHide = () => {
  showing.value = false
  target.value = {} as unknown as Stock
}

const onCreate = () => {
  showing.value = true
  updating.value = false
}

const onRowClick = (stock: Stock) => {
  showing.value = true
  updating.value = true
  target.value = stock
}

const onSubmit = () => {
  showing.value = false

  if (updating.value) {
    cstock.updateStock({
      Info: target.value,
      Message: {
        Error: {
          Title: t('MSG_UPDATE_STOCK'),
          Message: t('MSG_UPDATE_STOCK_FAIL'),
          Popup: true,
          Type: NotificationType.Error
        }
      }
    }, () => {
      // TODO
    })
    return
  }

  cstock.createStock({
    Info: target.value,
    Message: {
      Error: {
        Title: t('MSG_CREATE_STOCK'),
        Message: t('MSG_CREATE_STOCK_FAIL'),
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, () => {
    // TODO
  })
}

const onCancel = () => {
  onMenuHide()
}

</script>
