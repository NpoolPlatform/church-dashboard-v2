<template>
  <q-select
    :disable='!updating ? false : true'
    v-model='target'
    :options='coins'
    options-selected-class='text-deep-orange'
    emit-value
    label='MSG_SUPPORT_COINS'
    map-options
    multiple
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

interface Props {
  ids: string[]
  updating?: boolean
}

const props = defineProps<Props>()
const ids = toRef(props, 'ids')
const updating = toRef(props, 'updating')
const target = ref(ids.value)

const coins = computed(() => Array.from(sdk.coins.value).map((el) => {
  return {
    value: el.EntID,
    label: `${el.Name} | ${el.EntID} | ${el.ID} `
  }
}))

const emit = defineEmits<{(e: 'update:ids', coin: Array<string>): void}>()
const onUpdate = () => {
  emit('update:ids', target.value)
}

onMounted(() => {
  if (!coins.value.length) {
    sdk.getCoins(0, 0)
  }
})
</script>
