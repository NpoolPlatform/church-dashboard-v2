<template>
  <q-table
    dense
    flat
    :title='$t("MSG_COINS")'
    :rows='coins'
    row-key='ID'
    :loading='coinLoading'
    :rows-per-page-options='[10]'
  />
  <q-table
    dense
    flat
    :title='$t("MSG_GOODS")'
    :rows='goods'
    row-key='ID'
    :loading='goodLoading'
    :rows-per-page-options='[10]'
    selection='single'
    v-model:selected='selectedGood'
  >
    <template #top-right>
      <div class='row indent flat'>
        <div v-if='selectedGood.length === 0' class='column justify-center'>
          <span class='warning'>{{ $t('MSG_SELECT_GOOD') }}</span>
        </div>
        <q-btn
          dense
          flat
          class='btn flat'
          :label='$t("MSG_AUTHORIZE")'
          @click='onAuthorizeClick'
          :disable='selectedGood.length === 0'
        />
      </div>
    </template>
  </q-table>
  <q-table
    dense
    flat
    :title='$t("MSG_APP_GOODS")'
    :rows='appGoods'
    row-key='ID'
    :loading='appGoodLoading'
    :rows-per-page-options='[10]'
    selection='single'
    v-model:selected='selectedAppGood'
  >
    <template #top-right>
      <div class='row indent flat'>
        <div v-if='!appGood' class='column justify-center'>
          <span class='warning'>{{ $t('MSG_SELECT_APP_GOOD') }}</span>
        </div>
        <div class='column'>
          <q-space />
          <q-btn
            dense
            flat
            class='btn flat'
            :label='$t("MSG_SET_PRICE")'
            @click='onSetPriceClick'
            :disable='!appGood'
          />
        </div>
        <q-input
          dense
          flat
          class='small'
          v-if='appGood'
          v-model='appGood.Price'
          :label='$t("MSG_PRICE")'
        />
        <div class='column'>
          <q-space />
          <q-btn-toggle
            dense
            flat
            rounded
            class='toggle'
            :options='saleOptions'
            v-model='online'
            toggle-color='primary'
            size='0.625em'
            :disable='!appGood'
          />
        </div>
        <div class='column'>
          <q-space />
          <q-btn-toggle
            dense
            flat
            rounded
            class='toggle'
            :options='visibleOptions'
            v-model='visible'
            toggle-color='primary'
            size='0.625em'
            :disable='!appGood'
          />
        </div>
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
  AppGood,
  buildGoods,
  GoodBase,
  InitAreaStrategy,
  NotificationType,
  useAdminGoodStore,
  useChurchGoodStore,
  useCoinStore
} from 'npool-cli-v2'
import { useLocalApplicationStore } from 'src/localstore'
import { computed, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const app = useLocalApplicationStore()
const appID = computed(() => app.AppID)

const coin = useCoinStore()
const coins = computed(() => coin.Coins)
const coinLoading = ref(true)

const good = useChurchGoodStore()
const adminGood = useAdminGoodStore()

const appGoods = computed(() => good.AppGoods.get(appID.value) ? good.AppGoods.get(appID.value) as Array<AppGood> : [])
const goods = computed(() => {
  return buildGoods(adminGood.Goods).filter((good) => {
    return appGoods.value.findIndex((ag) => ag.GoodID === good.ID) < 0
  })
})
const selectedGood = ref([] as Array<GoodBase>)
const goodLoading = ref(true)

const appGoodLoading = ref(true)
const selectedAppGood = ref([] as Array<AppGood>)
const appGood = computed(() => selectedAppGood.value.length > 0 ? selectedAppGood.value[0] : undefined as unknown as AppGood)
const online = computed({
  get: () => appGood.value?.Online ? appGood.value?.Online : false,
  set: (val) => {
    onOnlineChange(val)
  }
})
const visible = computed({
  get: () => appGood.value?.Visible ? appGood.value?.Visible : false,
  set: (val: boolean) => {
    onVisibleChange(val)
  }
})

interface Option {
  label: string
  value: boolean
}

const saleOptions = computed(() => [
  {
    label: t('MSG_ONSALE'),
    value: true
  }, {
    label: t('MSG_OFFSALE'),
    value: false
  }
] as Array<Option>)

const visibleOptions = computed(() => [
  {
    label: t('MSG_VISIBLE'),
    value: true
  }, {
    label: t('MSG_HIDE'),
    value: false
  }
] as Array<Option>)

const prepare = () => {
  appGoodLoading.value = true
  good.getAppGoods({
    TargetAppID: appID.value,
    Message: {
      Error: {
        Title: 'MSG_GET_APP_GOODS',
        Message: 'MSG_GET_APP_GOODS_FAIL',
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, () => {
    appGoodLoading.value = false
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
    coinLoading.value = false
  })

  adminGood.getAllGoods({
    Message: {
      Error: {
        Title: 'MSG_GET_GOODS',
        Message: 'MSG_GET_GOODS_FAIL',
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, () => {
    goodLoading.value = false
  })

  prepare()
})

const onSetPriceClick = () => {
  good.setGoodPrice({
    TargetAppID: appID.value,
    Info: appGood.value,
    Message: {
      Error: {
        Title: 'MSG_SET_GOOD_PRICE',
        Message: 'MSG_SET_GOOD_PRICE_FAIL',
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, () => {
    // TODO
  })
}

const onVisibleChange = (visible: boolean) => {
  adminGood.updateGood({
    Info: {
      ID: appGood.value.ID,
      GoodID: appGood.value.GoodID,
      Price: appGood.value.Price,
      Online: appGood.value.Online,
      InitAreaStrategy: appGood.value.InitAreaStrategy,
      DisplayIndex: appGood.value.DisplayIndex,
      Visible: visible
    },
    Message: {
      Error: {
        Title: 'MSG_UPDATE_GOOD',
        Message: 'MSG_UPDATE_GOOD_FAIL',
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, () => {
    // TODO
  })
}

const onOnlineChange = (online: boolean) => {
  if (online) {
    good.onlineGood({
      TargetAppID: appID.value,
      Info: appGood.value,
      Message: {
        Error: {
          Title: 'MSG_ONLINE_GOOD',
          Message: 'MSG_ONLINE_GOOD_FAIL',
          Popup: true,
          Type: NotificationType.Error
        }
      }
    }, () => {
      appGood.value.Online = online
    })
    return
  }

  good.offlineGood({
    TargetAppID: appID.value,
    Info: appGood.value,
    Message: {
      Error: {
        Title: 'MSG_OFFLINE_GOOD',
        Message: 'MSG_OFFLINE_GOOD_FAIL',
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, () => {
    appGood.value.Online = online
  })
}

const onAuthorizeClick = () => {
  good.authorizeGood({
    TargetAppID: appID.value,
    Info: {
      GoodID: selectedGood.value[0].ID as string,
      Price: 0,
      Online: false,
      InitAreaStrategy: InitAreaStrategy.All,
      DisplayIndex: 0,
      Visible: true
    },
    Message: {
      Error: {
        Title: 'MSG_AUTHORIZE_GOOD',
        Message: 'MSG_AUTHORIZE_GOOD_FAIL',
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, () => {
    // TODO
  })
}

</script>
