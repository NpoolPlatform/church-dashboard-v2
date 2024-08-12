<template>
  <q-table
    dense
    flat
    :rows='displayChains'
    row-key='ID'
    :title='$t("MSG_CHAINS")'
    :rows-per-page-options='[20]'
    :columns='columns'
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
import { chain, sdk, utils } from 'src/npoolstore'
import { useI18n } from 'vue-i18n'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const _chain = chain.useChainStore()
const chains = computed(() => _chain.chains())

const name = ref('')
const displayChains = computed(() => {
  return chains.value.filter((el) => {
    return el.Nickname?.toLowerCase()?.includes?.(name.value?.toLowerCase()) ||
            el.ChainType?.toLowerCase()?.includes(name.value?.toLowerCase()) ||
            el.EntID?.toLowerCase()?.includes(name.value?.toLowerCase())
  })
})

onMounted(() => {
  if (!chains.value.length) {
    sdk.getChains(0, 0)
  }
})

const columns = computed(() => [
  {
    name: 'ID',
    label: t('MSG_ID'),
    sortable: true,
    field: (row: chain.Chain) => row.ID
  },
  {
    name: 'EntID',
    label: t('MSG_ENT_ID'),
    sortable: true,
    field: (row: chain.Chain) => row.EntID
  },
  {
    name: 'ChainID',
    label: t('MSG_CHAIN_ID'),
    sortable: true,
    field: (row: chain.Chain) => row.ChainID
  },
  {
    name: 'ChainType',
    label: t('MSG_CHAIN_TYPE'),
    sortable: true,
    field: (row: chain.Chain) => row.ChainType
  },
  {
    name: 'Logo',
    label: t('MSG_LOGO'),
    sortable: true,
    field: (row: chain.Chain) => row.Logo
  },
  {
    name: 'ENV',
    label: t('MSG_ENV'),
    sortable: true,
    field: (row: chain.Chain) => row.ENV
  },
  {
    name: 'NativeUnit',
    label: t('MSG_NATIVE_UNIT'),
    sortable: true,
    field: (row: chain.Chain) => row.NativeUnit
  },
  {
    name: 'AtomicUnit',
    label: t('MSG_ATOMIC_UNIT'),
    sortable: true,
    field: (row: chain.Chain) => row.AtomicUnit
  },
  {
    name: 'UnitExp',
    label: t('MSG_UNIT_EXP'),
    sortable: true,
    field: (row: chain.Chain) => row.UnitExp
  },
  {
    name: 'GasType',
    label: t('MSG_GAS_TYPE'),
    sortable: true,
    field: (row: chain.Chain) => row.GasType
  },
  {
    name: 'Nickname',
    label: t('MSG_NICKNAME'),
    sortable: true,
    field: (row: chain.Chain) => row.Nickname
  },
  {
    name: 'CreatedAt',
    label: 'MSG_CREATED_AT',
    sortable: true,
    field: (row: chain.Chain) => utils.formatTime(row.CreatedAt)
  },
  {
    name: 'UpdatedAt',
    label: 'MSG_UPDATED_AT',
    sortable: true,
    field: (row: chain.Chain) => utils.formatTime(row.UpdatedAt)
  }
])
</script>
