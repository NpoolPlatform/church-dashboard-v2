<template>
  <q-table
    dense
    flat
    :rows='coins'
    row-key='ID'
    :title='$t("MSG_COINS")'
    :rows-per-page-options='[10]'
    selection='single'
    v-model:selected='selectedCoin'
  >
    <template #top-right>
      <div class='row indent flat'>
        <q-btn
          dense
          flat
          class='btn flat'
          :label='$t("MSG_CREATE_DESCRIPTION")'
          @click='onCreateDescription'
          :disable='selectedCoin.length === 0'
        />
      </div>
    </template>
  </q-table>
  <q-table
    dense
    flat
    :rows='descriptions'
    row-key='ID'
    :title='$t("MSG_COIN_DESCRIPTIONS")'
    :rows-per-page-options='[5]'
    @row-click='(evt, row, index) => onRowClick(row as Description)'
  />
  <q-dialog
    v-model='showing'
    @hide='onMenuHide'
    position='right'
  >
    <q-card class='popup-menu'>
      <q-card-section>
        <span>{{ $t('MSG_CREATE_COIN') }}</span>
      </q-card-section>
      <q-card-section>
        <span>{{ $t('MSG_COIN_NAME') }}: {{ selectedCoin[0]?.Name }}</span>
      </q-card-section>
      <q-card-section>
        <q-input v-model='target.Title' :label='$t("MSG_TITLE")' />
        <q-input v-model='target.Message' :label='$t("MSG_MESSAGE")' type='textarea' />
      </q-card-section>
      <q-card-section>
        <q-select dense :options='CoinDescriptionUsedFors' v-model='target.UsedFor' :label='$t("MSG_USED_FOR")' />
      </q-card-section>
      <q-item class='row'>
        <q-btn class='btn round alt' :label='$t("MSG_SUBMIT")' @click='onSubmit' />
        <q-btn class='btn round' :label='$t("MSG_CANCEL")' @click='onCancel' />
      </q-item>
    </q-card>
  </q-dialog>
</template>

<script setup lang='ts'>
import { useCoinStore, NotificationType, Coin, CoinDescriptionUsedFors, useChurchCoinStore, Description } from 'npool-cli-v2'
import { computed, onMounted, ref, watch } from 'vue'

const coin = useCoinStore()
const coins = computed(() => coin.Coins)
const selectedCoin = ref([] as Array<Coin>)
const coinTypeID = computed(() => selectedCoin.value.length > 0 ? selectedCoin.value[0].ID : undefined as unknown as string)

const descriptions = computed(() => {
  const descs = coin.Descriptions.get(selectedCoin.value[0]?.ID as string) as Map<string, Description>
  console.log(descs)
  return descs ? Array.from(descs).map(([, val]) => val) : []
})

const ccoin = useChurchCoinStore()

onMounted(() => {
  coin.getCoins({
    Message: {
      Error: {
        Title: 'MSG_GET_COINS',
        Message: 'MSG_GET_COINS_FAIL',
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
const target = ref({} as unknown as Description)
watch(coinTypeID, () => {
  target.value.CoinTypeID = coinTypeID.value as string
})

const onRowClick = (desc: Description) => {
  target.value = desc
  showing.value = true
  updating.value = true
  selectedCoin.value = [coin.getCoinByID(desc.CoinTypeID)]
}

const onCreateDescription = () => {
  showing.value = true
  updating.value = false
}

const onMenuHide = () => {
  showing.value = false
  target.value = {
    coinTypeID: selectedCoin.value[0]?.ID
  } as unknown as Description
}

const onSubmit = () => {
  showing.value = false

  if (updating.value) {
    ccoin.updateDescription({
      ID: target.value.ID,
      CoinTypeID: target.value.CoinTypeID,
      Title: target.value.Title,
      Message: target.value.Message,
      UsedFor: target.value.UsedFor,
      NotifyMessage: {
        Error: {
          Title: 'MSG_UPDATE_DESCRIPTION',
          Message: 'MSG_UPDATE_DESCRIPTION_FAIL',
          Popup: true,
          Type: NotificationType.Error
        }
      }
    }, () => {
      // TODO
    })
    return
  }
  ccoin.createDescription({
    CoinTypeID: target.value.CoinTypeID,
    Title: target.value.Title,
    Message: target.value.Message,
    UsedFor: target.value.UsedFor,
    NotifyMessage: {
      Error: {
        Title: 'MSG_CREATE_DESCRIPTION',
        Message: 'MSG_CREATE_DESCRIPTION_FAIL',
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
