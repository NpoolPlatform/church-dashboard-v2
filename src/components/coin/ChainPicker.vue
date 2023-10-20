<template>
  <q-select
    :disable='!updating ? false : true'
    v-model='target'
    :options='displayChains'
    options-selected-class='text-deep-orange'
    emit-value
    label='MSG_CHAINS'
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
import { chain, sdk } from 'src/npoolstore'

interface Props {
  id: string
  updating?: boolean
}

const props = defineProps<Props>()
const id = toRef(props, 'id')
const updating = toRef(props, 'updating')
const target = ref(id.value)

const _chain = chain.useChainStore()
const chains = computed(() => Array.from(_chain.chains()).map((el) => {
  return {
    value: el.ChainID,
    label: `${el.ChainType} | ${el.ChainID} | ${el.EntID}`
  }
}))

const displayChains = ref(chains.value)

const onFilter = (val: string, doneFn: (callbackFn: () => void) => void) => {
  doneFn(() => {
    displayChains.value = chains.value.filter((el) => {
      return el?.label?.toLowerCase().includes(val.toLowerCase())
    })
  })
}

const emit = defineEmits<{(e: 'update:id', id: string): void}>()
const onUpdate = () => {
  emit('update:id', target.value)
}

onMounted(() => {
  if (!chains.value?.length) {
    sdk.getChains(0, 0)
  }
})

</script>
