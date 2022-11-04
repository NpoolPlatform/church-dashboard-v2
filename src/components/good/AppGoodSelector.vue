<template>
  <q-select
    v-model='target'
    :options='goods'
    options-selected-class='text-deep-orange'
    emit-value
    label='MSG_APP_GOODS'
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
import { useChurchAppGoodStore } from 'npool-cli-v4'
import { getAppGoods } from 'src/api/good'
import { useLocalApplicationStore } from 'src/localstore/application'
import { computed, defineEmits, defineProps, toRef, ref, onMounted, watch } from 'vue'

interface Props {
  id: string
}

const props = defineProps<Props>()
const goodID = toRef(props, 'id')
const target = ref(goodID.value)

const appGood = useChurchAppGoodStore()
const appGoods = computed(() => appGood.getGoodsByAppID(appID.value))

const goods = computed(() => Array.from(appGoods.value, (el) => {
  return {
    value: el.GoodID,
    label: el.GoodName
  }
}))

const emit = defineEmits<{(e: 'update:appgood', coin: string): void}>()
const onUpdate = () => {
  emit('update:appgood', target.value)
}

const app = useLocalApplicationStore()
const appID = computed(() => app.AppID)

watch(appID, () => {
  prepare()
})

onMounted(() => {
  prepare()
})

const prepare = () => {
  if (appGoods.value.length === 0) {
    getAppGoods(0, 500)
  }
}
</script>
