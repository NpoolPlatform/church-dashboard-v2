<template>
  <q-table
    dense
    flat
    :rows='displayFeeds'
    row-key='ID'
    :title='$t("MSG_COIN_FEEDS")'
    :rows-per-page-options='[10]'
    :columns='columns'
    @row-click='(evt, row, index) => onRowClick(row as Feed)'
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
        <q-select :options='Object.values(FeedType)' v-model='target.FeedType' :label='$t("MSG_FEED_TYPE")' />
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
import { NotifyType, formatTime } from 'npool-cli-v4'
import { useCoinFeedStore } from 'src/teststore/coin/currency/feed'
import { Feed } from 'src/teststore/coin/currency/feed/types'
import { FeedType } from 'src/teststore/fiat-currency/types'
import { computed, onMounted, ref, defineAsyncComponent } from 'vue'
import { useI18n } from 'vue-i18n'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const LoadingButton = defineAsyncComponent(() => import('src/components/button/LoadingButton.vue'))
const CoinPicker = defineAsyncComponent(() => import('src/components/coin/CoinPicker.vue'))
const CoinFiat = defineAsyncComponent(() => import('src/components/coin/CoinFiat.vue'))

const feed = useCoinFeedStore()
const feeds = computed(() => feed.feeds())

const name = ref('')
const displayFeeds = computed(() => {
  return feeds.value.filter((el) => el.CoinName?.toLowerCase()?.includes?.(name.value?.toLowerCase()) ||
    el.ID?.toLowerCase()?.includes(name.value?.toLowerCase()) ||
    el.CoinTypeID?.toLowerCase()?.includes(name.value?.toLowerCase())
  )
})

const showing = ref(false)
const updating = ref(false)
const target = ref({} as Feed)

const onCreate = () => {
  showing.value = true
  updating.value = false
}

const onRowClick = (row: Feed) => {
  target.value = { ...row }
  showing.value = true
  updating.value = true
}

const onCancel = () => {
  onMenuHide()
}

const onMenuHide = () => {
  showing.value = false
  target.value = {} as Feed
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
        Type: NotifyType.Error
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
        Type: NotifyType.Error
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
  if (feed.Feeds.Feeds.length === 0) {
    getFeeds(0, 100)
  }
})

const getFeeds = (offset: number, limit: number) => {
  feed.getFeeds({
    Offset: offset,
    Limit: limit,
    Message: {}
  }, (error: boolean, rows: Feed[]) => {
    if (error || rows.length === 0) {
      return
    }
    getFeeds(offset + limit, limit)
  })
}

const columns = computed(() => [
  {
    name: 'ID',
    label: t('MSG_ID'),
    field: (row: Feed) => row.ID
  },
  {
    name: 'CoinTypeID',
    label: t('MSG_COIN_TYPE_ID'),
    field: (row: Feed) => row.CoinTypeID
  },
  {
    name: 'CoinName',
    label: t('MSG_COIN_NAME'),
    field: (row: Feed) => row.CoinName
  },
  {
    name: 'CoinUnit',
    label: t('MSG_COIN_UNIT'),
    field: (row: Feed) => row.CoinUnit
  },
  {
    name: 'CoinEnv',
    label: t('MSG_COIN_ENV'),
    field: (row: Feed) => row.CoinENV
  },
  {
    name: 'FeedType',
    label: t('MSG_FEED_TYPE'),
    field: (row: Feed) => row.FeedType
  },
  {
    name: 'FeedCoinName',
    label: t('MSG_FEED_COIN_NAME'),
    field: (row: Feed) => row.FeedCoinName
  },
  {
    name: 'Disabled',
    label: t('MSG_DISABLED'),
    field: (row: Feed) => row.Disabled
  },
  {
    name: 'CreatedAt',
    label: 'MSG_CREATED_AT',
    field: (row: Feed) => formatTime(row.CreatedAt)
  },
  {
    name: 'UpdatedAt',
    label: 'MSG_UPDATED_AT',
    field: (row: Feed) => formatTime(row.UpdatedAt)
  }
])
</script>
