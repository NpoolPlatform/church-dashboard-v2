<template>
  <q-table
    dense
    flat
    :rows='productInfos'
    row-key='ID'
    :title='$t("MSG_COIN_PRODUCT_INFOS")'
    :rows-per-page-options='[5]'
    @row-click='(evt, row, index) => onRowClick(row as ProductInfo)'
  >
    <template #top-right>
      <div class='row indent flat'>
        <q-btn
          dense
          flat
          class='btn flat'
          :label='$t("MSG_CREATE_PRODUCT_INFO")'
          @click='onCreateProductInfo'
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
        <!-- <span>{{ $t('MSG_CREATE_COIN') }}</span> -->
      </q-card-section>
      <q-card-section>
        <CoinPicker v-model:id='target.CoinTypeID' :updating='updating' />
      </q-card-section>
      <q-card-section>
        <q-input v-model='target.ProductPage' :label='$t("MSG_PRODUCT_PAGE")' />
      </q-card-section>
      <q-item class='row'>
        <q-btn class='btn round alt' :label='$t("MSG_SUBMIT")' @click='onSubmit' />
        <q-btn class='btn round' :label='$t("MSG_CANCEL")' @click='onCancel' />
      </q-item>
    </q-card>
  </q-dialog>
</template>

<script setup lang='ts'>
import { NotificationType, ProductInfo, useChurchCoinStore as OldUseChurchCoinStore } from 'npool-cli-v2'
import { useLocalApplicationStore } from 'src/localstore'
import { computed, defineAsyncComponent, onMounted, ref, watch } from 'vue'

const CoinPicker = defineAsyncComponent(() => import('src/components/coin/CoinPicker.vue'))

const app = useLocalApplicationStore()
const appID = computed(() => app.AppID)

const coin = OldUseChurchCoinStore()
const productInfos = computed(() => coin.ProductInfos.get(appID.value) as Array<ProductInfo>)

const showing = ref(false)
const updating = ref(false)
const target = ref({} as ProductInfo)

const onRowClick = (row: ProductInfo) => {
  target.value = { ...row }
  showing.value = true
  updating.value = true
}

const onCreateProductInfo = () => {
  showing.value = true
  updating.value = false
  target.value = {
    AppID: appID.value
  } as ProductInfo
}

const onMenuHide = () => {
  showing.value = false
}

const onSubmit = () => {
  showing.value = false

  if (updating.value) {
    coin.updateProductInfo({
      Info: target.value,
      Message: {
        Error: {
          Title: 'MSG_UPDATE_PRODUCT_INFO',
          Message: 'MSG_UPDATE_PRODUCT_INFO_FAIL',
          Popup: true,
          Type: NotificationType.Error
        }
      }
    }, () => {
      // TODO
    })
    return
  }
  coin.createProductInfo({
    TargetAppID: appID.value,
    Info: target.value,
    Message: {
      Error: {
        Title: 'MSG_CREATE_PRODUCT_INFO',
        Message: 'MSG_CREATE_PRODUCT_INFO_FAIL',
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

const prepare = () => {
  coin.getProductInfos({
    TargetAppID: appID.value,
    Message: {
      Error: {
        Title: 'MSG_GET_COIN_PRODUCT_INFOS',
        Message: 'MSG_GET_COIN_PRODUCT_INFOS_FAIL',
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, () => {
    // TODO
  })
}

watch(appID, () => {
  prepare()
})

onMounted(() => {
  prepare()
})

</script>
