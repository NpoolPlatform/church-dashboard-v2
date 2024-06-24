<template>
  <q-select
    :disable='!updating ? false : true'
    v-model='target'
    :options='displayPools'
    options-selected-class='text-deep-orange'
    emit-value
    label='MSG_POOLS'
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
import { computed, defineEmits, defineProps, toRef, ref, onMounted } from 'vue'
import { sdk } from 'src/npoolstore'

interface Props {
  miningPoolId: string
  updating?: boolean
}

const props = defineProps<Props>()
const miningPoolId = toRef(props, 'miningPoolId')
const updating = toRef(props, 'updating')
const target = ref(miningPoolId.value)

const pools = computed(() => Array.from(sdk.miningPools.value).map((el) => {
  return {
    value: el.EntID,
    label: `${el.Name} | ${el.MiningpoolType} | ${el.EntID}`
  }
}))

const displayPools = ref(pools.value)

const onFilter = (val: string, doneFn: (callbackFn: () => void) => void) => {
  doneFn(() => {
    displayPools.value = pools.value.filter((el) => {
      return el?.label?.toLowerCase().includes(val.toLowerCase())
    })
  })
}

const emit = defineEmits<{(e: 'update:miningPoolId', miningPoolId: string): void}>()
const onUpdate = () => {
  emit('update:miningPoolId', target.value)
}

onMounted(() => {
  if (!pools.value?.length) {
    sdk.getMiningPools(0, 0)
  }
})

</script>
