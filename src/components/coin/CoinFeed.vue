<template>
  <q-table
    dense
    flat
    :rows='displayFeeds'
    row-key='ID'
    :title='$t("MSG_COIN_FEEDS")'
    :rows-per-page-options='[100]'
    :columns='columns'
    @row-click='(evt, row, index) => onRowClick(row as coincurrencyfeed.CoinFeed)'
  >
    <template #top-right>
      <div class='row indent flat'>
        <q-input
          dense
          flat
          class='small'
          v-model='name'
          :label='$t("MSG")'
        />
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
        <CoinPicker v-model:id='target.CoinTypeID' :updating='updating' />
        <q-input v-model='target.FeedCoinName' :label='$t("MSG_FEED_COIN_NAME")' />
        <q-select :options='chainbase.CurrencyFeedTypes' v-model='target.FeedType' :label='$t("MSG_FEED_TYPE")' />
      </q-card-section>
      <q-card-section v-if='updating'>
        <div>
          <q-toggle dense v-model='target.Disabled' :label='$t("MSG_DISABLE")' />
        </div>
      </q-card-section>
      <q-item class='row'>
        <LoadingButton loading :label='$t("MSG_SUBMIT")' @click='onSubmit' />
        <q-btn class='btn round' :label='$t("MSG_CANCEL")' @click='onCancel' />
      </q-item>
    </q-card>
  </q-dialog>
  <CoinFiat />
</template>

<script setup lang='ts'>
import { computed, onMounted, ref, defineAsyncComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import { coincurrencyfeed, notify, utils, chainbase } from 'src/npoolstore'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const LoadingButton = defineAsyncComponent(() => import('src/components/button/LoadingButton.vue'))
const CoinPicker = defineAsyncComponent(() => import('src/components/coin/CoinPicker.vue'))
const CoinFiat = defineAsyncComponent(() => import('src/components/coin/CoinFiat.vue'))

const feed = coincurrencyfeed.useCoinFeedStore()
const feeds = computed(() => feed.feeds())

const name = ref('')
const displayFeeds = computed(() => {
  return feeds.value.filter((el) => {
    return el.CoinName?.toLowerCase()?.includes?.(name.value?.toLowerCase()) ||
          el.ID?.toLowerCase()?.includes(name.value?.toLowerCase()) ||
          el.CoinTypeID?.toLowerCase()?.includes(name.value?.toLowerCase())
  })
})

const showing = ref(false)
const updating = ref(false)
const target = ref({} as coincurrencyfeed.CoinFeed)

const onCreate = () => {
  showing.value = true
  updating.value = false
}

const onRowClick = (row: coincurrencyfeed.CoinFeed) => {
  target.value = { ...row }
  showing.value = true
  updating.value = true
}

const onCancel = () => {
  onMenuHide()
}

const onMenuHide = () => {
  showing.value = false
  target.value = {} as coincurrencyfeed.CoinFeed
}

const onSubmit = (done: () => void) => {
  updating.value ? updateFeed(done) : createFeed(done)
}

const createFeed = (done: () => void) => {
  feed.createFeed({
    ...target.value,
    Message: {
      Error: {
        Title: 'MSG_CREATE_COIN_FEED',
        Message: 'MSG_CREATE_COIN_FEED_FAIL',
        Popup: true,
        Type: notify.NotifyType.Error
      }
    }
  }, (error: boolean) => {
    done()
    if (error) {
      return
    }
    onMenuHide()
  })
}

const updateFeed = (done: () => void) => {
  feed.updateFeed({
    ID: target.value?.ID,
    FeedCoinName: target.value?.FeedCoinName,
    Disabled: target.value?.Disabled,
    Message: {
      Error: {
        Title: 'MSG_UPDATE_COIN_FEED',
        Message: 'MSG_UPDATE_COIN_FEED_FAIL',
        Popup: true,
        Type: notify.NotifyType.Error
      }
    }
  }, (error: boolean) => {
    done()
    if (error) {
      return
    }
    onMenuHide()
  })
}

onMounted(() => {
  if (!feeds.value.length) {
    getFeeds(0, 100)
  }
})

const getFeeds = (offset: number, limit: number) => {
  feed.getFeeds({
    Offset: offset,
    Limit: limit,
    Message: {}
  }, (error: boolean, rows?: coincurrencyfeed.CoinFeed[]) => {
    if (error || !rows?.length) {
      return
    }
    getFeeds(offset + limit, limit)
  })
}

const columns = computed(() => [
  {
    name: 'ID',
    label: t('MSG_ID'),
    sortable: true,
    field: (row: coincurrencyfeed.CoinFeed) => row.ID
  },
  {
    name: 'CoinTypeID',
    label: t('MSG_COIN_TYPE_ID'),
    sortable: true,
    field: (row: coincurrencyfeed.CoinFeed) => row.CoinTypeID
  },
  {
    name: 'CoinName',
    label: t('MSG_COIN_NAME'),
    sortable: true,
    field: (row: coincurrencyfeed.CoinFeed) => row.CoinName
  },
  {
    name: 'CoinUnit',
    label: t('MSG_COIN_UNIT'),
    sortable: true,
    field: (row: coincurrencyfeed.CoinFeed) => row.CoinUnit
  },
  {
    name: 'CoinEnv',
    label: t('MSG_COIN_ENV'),
    sortable: true,
    field: (row: coincurrencyfeed.CoinFeed) => row.CoinENV
  },
  {
    name: 'FeedType',
    label: t('MSG_FEED_TYPE'),
    sortable: true,
    field: (row: coincurrencyfeed.CoinFeed) => row.FeedType
  },
  {
    name: 'FeedCoinName',
    label: t('MSG_FEED_COIN_NAME'),
    sortable: true,
    field: (row: coincurrencyfeed.CoinFeed) => row.FeedCoinName
  },
  {
    name: 'Disabled',
    label: t('MSG_DISABLED'),
    sortable: true,
    field: (row: coincurrencyfeed.CoinFeed) => row.Disabled
  },
  {
    name: 'CreatedAt',
    label: 'MSG_CREATED_AT',
    sortable: true,
    field: (row: coincurrencyfeed.CoinFeed) => utils.formatTime(row.CreatedAt)
  },
  {
    name: 'UpdatedAt',
    label: 'MSG_UPDATED_AT',
    sortable: true,
    field: (row: coincurrencyfeed.CoinFeed) => utils.formatTime(row.UpdatedAt)
  }
])
</script>
