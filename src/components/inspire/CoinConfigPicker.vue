<template>
  <q-select
    v-model='target'
    :options='displayCoinConfigs'
    options-selected-class='text-deep-orange'
    emit-value
    map-options
    label='MSG_COIN_CONFIG'
    use-input
    @filter='onFilter'
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
import { computed, defineEmits, defineProps, toRef, ref, onMounted } from 'vue'
import { sdk } from 'src/npoolstore'
import { AppID } from 'src/npoolstore/sdk'

interface Props {
  id: string
}

const props = defineProps<Props>()
const coinConfigId = toRef(props, 'id')
const target = ref(coinConfigId.value)

const coinConfigs = sdk.coinConfigs
const _coinConfigs = computed(() => Array.from(coinConfigs.value).map((el) => {
  return {
    value: el.EntID,
    label: `${el.EntID} | ${el.CoinTypeID}| ${el.CoinName}| ${el.MaxValue}| ${el.Allocated}`
  }
}))

const displayCoinConfigs = ref(_coinConfigs.value)

const onFilter = (val: string, doneFn: (callbackFn: () => void) => void) => {
  doneFn(() => {
    displayCoinConfigs.value = _coinConfigs.value.filter((el) => {
      return el.label.toLowerCase().includes(val.toLowerCase())
    })
  })
}

const emit = defineEmits<{(e: 'update:id', id: string): void}>()
const onUpdate = () => {
  emit('update:id', target.value)
}

onMounted(() => {
  const targetAppID = AppID.value
  if (!coinConfigs.value.length) {
    sdk.getCoinConfigs(targetAppID, 0, 0)
  }
})
</script>
