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
import { useLocalApplicationStore } from 'src/localstore'
import { computed, onMounted, ref, watch } from 'vue'

const app = useLocalApplicationStore()
const appID = computed(() => app.AppID)

const coin = useCoinStore()
const coins = computed(() => coin.Coins)
const selectedCoin = ref([] as Array<Coin>)
const coinTypeID = computed(() => selectedCoin.value.length > 0 ? selectedCoin.value[0].ID : undefined as unknown as string)

const ccoin = useChurchCoinStore()
const descriptions = computed(() => ccoin.Descriptions.get(appID.value) as Array<Description>)

const prepare = () => {
  ccoin.getDescriptions({
    TargetAppID: appID.value,
    Message: {
      Error: {
        Title: 'MSG_GET_COIN_DESCRIPTIONS',
        Message: 'MSG_GET_COIN_DESCRIPTIONS_FAIL',
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

  prepare()
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
  target.value = {
    AppID: appID.value,
    CoinTypeID: selectedCoin.value[0].ID
  } as unknown as Description
}

const onMenuHide = () => {
  showing.value = false
}

const onSubmit = () => {
  showing.value = false

  if (updating.value) {
    ccoin.updateDescription({
      Info: target.value,
      Message: {
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
    TargetAppID: appID.value,
    Info: target.value,
    Message: {
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
