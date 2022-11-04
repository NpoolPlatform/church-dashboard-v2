<template>
  <q-select
    v-model='target'
    :options='displayGoods'
    options-selected-class='text-deep-orange'
    emit-value
    label='MSG_GOODS'
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
import { useChurchGoodStore } from 'npool-cli-v4'
import { getGoods } from 'src/api/good'
import { useLocalApplicationStore } from 'src/localstore/application'
import { computed, defineEmits, defineProps, toRef, ref, onMounted, watch } from 'vue'

interface Props {
  id: string
}

const props = defineProps<Props>()
const goodID = toRef(props, 'id')
const target = ref(goodID.value)

const good = useChurchGoodStore()
const goods = computed(() => Array.from(good.Goods.Goods, (el) => {
  return {
    value: el.ID,
    label: el.Title
  }
}))
const displayGoods = ref(goods.value)

const onFilter = (val: string, doneFn: (callbackFn: () => void) => void) => {
  doneFn(() => {
    displayGoods.value = goods.value.filter((el) => {
      return el.label.toLowerCase().includes(val.toLowerCase())
    })
  })
}

const emit = defineEmits<{(e: 'update:good', coin: string): void}>()
const onUpdate = () => {
  emit('update:good', target.value)
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
  if (goods.value.length === 0) {
    getGoods(0, 500)
  }
}
</script>
