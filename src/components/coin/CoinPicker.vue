<template>
  <q-select
    :disable='!updating ? false : true'
    v-model='target'
    :options='coins'
    options-selected-class='text-deep-orange'
    emit-value
    label='MSG_COINS'
    map-options
    @update:model-value='onUpdate'
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
import { NotificationType, useCoinStore } from 'npool-cli-v2'
import { computed, defineEmits, defineProps, toRef, ref, onMounted } from 'vue'

interface Props {
  coin: string
  updating?: boolean
}

const props = defineProps<Props>()
const coin = toRef(props, 'coin')
const updating = toRef(props, 'updating')
const target = ref(coin.value)
const coinStore = useCoinStore()

const coins = computed(() => Array.from(coinStore.Coins).map((el) => {
  return {
    value: el.ID,
    label: el.Name
  }
}))

const emit = defineEmits<{(e: 'update:coin', coin: string): void}>()
const onUpdate = () => {
  emit('update:coin', target.value)
}

onMounted(() => {
  if (coinStore.Coins.length === 0) {
    coinStore.getCoins({
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
  }
})
</script>
