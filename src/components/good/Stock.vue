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
  <q-card>
    <q-card-section class='bg-primary text-white'>
      {{ $t('MSG_ADVERTISEMENT_POSITION') }}
    </q-card-section>
  </q-card>
</template>

<script setup lang='ts'>
import {
  NotificationType,
  Stock,
  useAdminGoodStore,
  useStockState
} from 'npool-cli-v2'
import { computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const adminGood = useAdminGoodStore()
const stock = useStockState()

interface MyStock extends Stock {
  GoodName: string
}

const stocks = computed(() => Array.from(stock.Stocks).map((el) => {
  const s = el as MyStock
  s.GoodName = adminGood.getGoodByID(el.GoodID)?.Good.Good.Title
  return s
}))

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

const onCreate = () => {
  // TODO
}

const onRowClick = (stock: Stock) => {
  console.log(stock)
}

</script>
