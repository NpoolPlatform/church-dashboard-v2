<template>
  <q-table
    dense
    flat
    :rows='displayChains'
    row-key='ID'
    :title='$t("MSG_CHAINS")'
    :rows-per-page-options='[100]'
  >
    <template #top-right>
      <div class='row indent flat'>
        <q-input
          dense
          flat
          class='small'
          v-model='name'
          :label='$t("MSG_CHAIN_NAME")'
        />
      </div>
    </template>
  </q-table>
</template>

<script setup lang='ts'>
import { computed, onMounted, ref } from 'vue'
import { chain, sdk } from 'src/npoolstore'

const _chain = chain.useChainStore()
const chains = computed(() => _chain.chains())

const name = ref('')
const displayChains = computed(() => {
  return chains.value.filter((el) => {
    return el.ChainName?.toLowerCase()?.includes?.(name.value?.toLowerCase()) ||
            el.ChainType?.toLowerCase()?.includes(name.value?.toLowerCase()) ||
            el.EntID?.toLowerCase()?.includes(name.value?.toLowerCase())
  })
})

onMounted(() => {
  if (!chains.value.length) {
    sdk.getChains(0, 0)
  }
})
</script>
