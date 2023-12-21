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
import { getAppGoods } from 'src/api/good'
import { AppID } from 'src/api/app'
import { computed, defineEmits, defineProps, toRef, ref, onMounted, watch } from 'vue'
import { appgood } from 'src/npoolstore'

interface Props {
  id: string | undefined
}

const props = defineProps<Props>()
const goodID = toRef(props, 'id')
const target = ref(goodID.value)

const appGood = appgood.useAppGoodStore()
const appGoods = computed(() => appGood.goods(AppID.value))

const goods = computed(() => Array.from(appGoods.value, (el) => {
  return {
    value: el.EntID,
    label: `${el.GoodName} | ${el.EntID}`
  }
}))

const emit = defineEmits<{(e: 'update:id', id: string | undefined): void}>()
const onUpdate = () => {
  emit('update:id', target.value)
}

watch(AppID, () => {
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
