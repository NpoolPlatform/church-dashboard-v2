<template>
  <q-select
    :disable='!updating ? false : true'
    v-model='target'
    :options='displayCoins'
    options-selected-class='text-deep-orange'
    emit-value
    label='MSG_APP_COINS'
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
import { computed, defineEmits, defineProps, toRef, ref, onMounted, watch } from 'vue'
import { sdk } from 'src/npoolstore'

const AppID = sdk.AppID

interface Props {
  coinTypeId: string
  updating?: boolean
  coinTypeIds?: string[]
}

const props = defineProps<Props>()
const coinTypeId = toRef(props, 'coinTypeId')
const coinTypeIds = toRef(props, 'coinTypeIds')
const updating = toRef(props, 'updating')
const target = ref(coinTypeId.value)

const appCoins = sdk.appCoin.appCoins
const _appCoins = computed(() => Array.from(appCoins.value.filter((el) => !el.Disabled && (!coinTypeIds.value || coinTypeIds.value?.includes(el.CoinTypeID)))).map((el) => {
  return {
    value: el.CoinTypeID,
    label: `${el.Name} | ${el.CoinTypeID}`
  }
}))
const displayCoins = ref(_appCoins.value)

const onFilter = (val: string, doneFn: (callbackFn: () => void) => void) => {
  doneFn(() => {
    displayCoins.value = _appCoins.value.filter((el) => {
      return el?.label?.toLowerCase().includes(val.toLowerCase())
    })
  })
}

const emit = defineEmits<{(e: 'update:coinTypeId', coinTypeId: string): void}>()
const onUpdate = () => {
  emit('update:coinTypeId', target.value)
}

onMounted(() => {
  if (!appCoins.value.length) {
    sdk.appCoin.adminGetAppCoins(0, 0)
  }
})

watch(AppID, () => {
  if (!appCoins.value.length) {
    sdk.appCoin.adminGetAppCoins(0, 0)
  }
})
</script>
