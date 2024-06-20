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
  id: string
  updating?: boolean
}

const props = defineProps<Props>()
const id = toRef(props, 'id')
const updating = toRef(props, 'updating')
const target = ref(id.value)

const appCoins = sdk.appCoins
const _appCoins = computed(() => Array.from(appCoins.value.filter((el) => !el.Disabled)).map((el) => {
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

const emit = defineEmits<{(e: 'update:id', id: string): void}>()
const onUpdate = () => {
  emit('update:id', target.value)
}

onMounted(() => {
  if (!appCoins.value.length) {
    sdk.getAppCoins(0, 0)
  }
})

watch(AppID, () => {
  if (!appCoins.value.length) {
    sdk.getAppCoins(0, 0)
  }
})
</script>
