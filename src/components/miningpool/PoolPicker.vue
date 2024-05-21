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
import { useI18n } from 'vue-i18n'
import { computed, defineEmits, defineProps, toRef, ref, onMounted } from 'vue'
import { miningpoolpool, notify } from 'src/npoolstore'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

interface Props {
  id: string
  updating?: boolean
}

const props = defineProps<Props>()
const id = toRef(props, 'id')
const updating = toRef(props, 'updating')
const target = ref(id.value)

const poolInfo = miningpoolpool.useMiningpoolPoolStore()
const pools = computed(() => Array.from(poolInfo.pools()).map((el) => {
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

const emit = defineEmits<{(e: 'update:id', id: string): void}>()
const onUpdate = () => {
  emit('update:id', target.value)
}

const getPools = (offset: number, limit: number) => {
  poolInfo.getPools({
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: t('MSG_ADMIN_GET_POOLS'),
        Message: t('MSG_ADMIN_GET_POOL_FAIL'),
        Popup: true,
        Type: notify.NotifyType.Error
      }
    }
  }, (error: boolean, pools?: Array<miningpoolpool.Pool>) => {
    if (error || !pools?.length) {
      console.log('get pools end')
    }
  })
}

onMounted(() => {
  if (!pools.value?.length) {
    getPools(0, 0)
  }
})

</script>
