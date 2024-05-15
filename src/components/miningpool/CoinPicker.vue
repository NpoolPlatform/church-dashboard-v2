<template>
  <q-select
    :disable='!updating ? false : true'
    v-model='target'
    :options='displayCoins'
    options-selected-class='text-deep-orange'
    emit-value
    label='MSG_COINS'
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
import { miningpoolcoin, notify } from 'src/npoolstore'

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

const _coin = miningpoolcoin.useMiningpoolCoinStore()
const coins = computed(() => Array.from(_coin.coins()).map((el) => {
  return {
    value: el.EntID,
    label: `${el.CoinType} | ${el.MiningpoolType} | ${el.EntID}`
  }
}))

const displayCoins = ref(coins.value)

const onFilter = (val: string, doneFn: (callbackFn: () => void) => void) => {
  doneFn(() => {
    displayCoins.value = coins.value.filter((el) => {
      return el?.label?.toLowerCase().includes(val.toLowerCase())
    })
  })
}

const emit = defineEmits<{(e: 'update:id', id: string): void}>()
const onUpdate = () => {
  emit('update:id', target.value)
}
const coinInfo = miningpoolcoin.useMiningpoolCoinStore()

const getCoins = (offset: number, limit: number) => {
  coinInfo.getCoins({
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: t('MSG_ADMIN_GET_COINS'),
        Message: t('MSG_ADMIN_GET_COIN_FAIL'),
        Popup: true,
        Type: notify.NotifyType.Error
      }
    }
  }, (error: boolean, coins?: Array<miningpoolcoin.Coin>) => {
    if (error || !coins?.length) {
      console.log('get coins end')
    }
  })
}

onMounted(() => {
  if (!coins.value?.length) {
    getCoins(0, 0)
  }
})

</script>
