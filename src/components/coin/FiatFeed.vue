<template>
  <q-table
    dense
    flat
    :rows='displayFeeds'
    row-key='ID'
    :title='$t("MSG_FIAT_FEEDS")'
    :rows-per-page-options='[10]'
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
        <FiatPicker v-model:id='target.FiatID' :updating='updating' :label='"MSG_FIAT_ID"' />
        <q-input v-model='target.FeedFiatName' :label='$t("MSG_FEED_FIAT_NAME")' />
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
</template>

<script setup lang='ts'>
import { NotifyType } from 'npool-cli-v4'
import { useFiatFeedStore } from 'src/teststore/fiat/currency/feed'
import { Feed } from 'src/teststore/fiat/currency/feed/types'
import { computed, onMounted, ref, defineAsyncComponent } from 'vue'

const LoadingButton = defineAsyncComponent(() => import('src/components/button/LoadingButton.vue'))
const FiatPicker = defineAsyncComponent(() => import('src/components/coin/FiatPicker.vue'))

const feed = useFiatFeedStore()
const feeds = computed(() => feed.Feeds.Feeds)

const name = ref('')
const displayFeeds = computed(() => {
  return feeds.value.filter((el) => el.FiatName?.toLowerCase()?.includes?.(name.value?.toLowerCase()) || el.ID?.toLowerCase()?.includes(name.value?.toLowerCase()))
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
        Title: 'MSG_CREATE_FIAT_FEED',
        Message: 'MSG_CREATE_FIAT_FEED_FAIL',
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
    FeedFiatName: target.value?.FeedFiatName,
    Disabled: target.value?.Disabled,
    Message: {
      Error: {
        Title: 'MSG_UPDATE_FIAT_FEED',
        Message: 'MSG_UPDATE_FIAT_FEED_FAIL',
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
</script>