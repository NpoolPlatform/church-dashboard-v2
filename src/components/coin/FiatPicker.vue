<template>
  <q-select
    :disable='!updating ? false : true'
    v-model='target'
    :options='displayFiats'
    options-selected-class='text-deep-orange'
    emit-value
    :label='myLabel'
    map-options
    @update:model-value='onUpdate'
    use-input
    @filter='onFilter'
  >
    <template #option='scope'>
      <q-item v-bind='scope.itemProps'>
        <q-item-section>
          <q-item-label>{{ scope.opt.label }}</q-item-label>
        </q-item-section>
      </q-item>
    </template>
  </q-select>
</template>
<script setup lang='ts'>
import { useFiatFeedStore } from 'src/teststore/fiat/currency/feed'
import { Feed } from 'src/teststore/fiat/currency/feed/types'
import { computed, defineEmits, defineProps, toRef, ref, onMounted } from 'vue'

interface Props {
  id: string
  updating?: boolean
  label?: string,
  getData?: boolean
}

const props = defineProps<Props>()
const id = toRef(props, 'id')
const updating = toRef(props, 'updating')
const label = toRef(props, 'label')

const myLabel = computed(() => {
  return !label.value ? 'MSG_FiatS' : label.value
})

const target = ref(id.value)

const feed = useFiatFeedStore()
const feeds = computed(() => Array.from(feed.Feeds.Feeds).map((el) => {
  return {
    value: el.ID,
    label: `${el.FiatName} | ${el.ID}`
  }
}))
const displayFiats = ref(feeds.value)

const onFilter = (val: string, doneFn: (callbackFn: () => void) => void) => {
  doneFn(() => {
    displayFiats.value = feeds.value.filter((el) => {
      return el?.label?.toLowerCase().includes(val.toLowerCase())
    })
  })
}

const emit = defineEmits<{(e: 'update:id', id: string): void}>()
const onUpdate = () => {
  emit('update:id', target.value)
}

onMounted(() => {
  if (feed.Feeds.Feeds.length === 0) {
    getFeeds(0, 500)
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
