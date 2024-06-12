<template>
  <div v-for='(group, index) in target' :key='index'>
    <q-select
      :disable='!updating ? false : true'
      v-model='group.CoinConfigID'
      :options='displayCoupons'
      options-selected-class='text-deep-orange'
      emit-value
      label='MSG_COUPONS'
      map-options
      @update:model-value='onUpdate'
      use-input
      @filter='onFilter'
    />
    <q-input v-model='group.CoinValue' :label='$t("MSG_COIN_VALUE")' />
    <q-input v-model='group.CoinPreUSD' :label='$t("MSG_COIN_PRE_USD")' />
    <q-btn icon='remove' @click='removeInputGroup(index)' color='negative' />
  </div>
  <q-btn @click='addInputGroup'>
    +
  </q-btn>
</template>
<script setup lang='ts'>
import { coupon, eventinspire } from 'src/npoolstore'
import { computed, defineEmits, defineProps, toRef, ref, onMounted } from 'vue'
import { getCoupons } from 'src/api/inspire'

interface Props {
  coins: Array<eventinspire.EventCoinReq>
  updating?: boolean
}

const props = defineProps<Props>()
const coins = toRef(props, 'coins')
const updating = toRef(props, 'updating')
const target = ref(coins.value)

const _coupon = coupon.useCouponStore()
const myCoupons = computed(() => _coupon.coupons().filter((el) => _coupon.valid(undefined, el.ID)))
const coupons = computed(() => myCoupons.value.map((el) => {
  return {
    value: el.EntID,
    label: `${el.ID} | ${el.EntID} | ${el.Name} | ${el.CouponType} | ${el.Denomination} | ${el.CouponScope}`
  }
}))
const displayCoupons = ref(coupons.value.filter((el) => el.value))

const onFilter = (val: string, doneFn: (callbackFn: () => void) => void) => {
  doneFn(() => {
    displayCoupons.value = coupons.value.filter((el) => {
      return el?.label?.toLowerCase().includes(val.toLowerCase())
    })
  })
}

const emit = defineEmits<{(e: 'update:coins', coins: Array<eventinspire.EventCoinReq>): void}>()
const onUpdate = () => {
  console.log('coins: ', coins)
  emit('update:coins', target.value)
}

onMounted(() => {
  if (coupons.value.length === 0) {
    getCoupons(0, 100)
  }
})

const addInputGroup = () => {
  target.value.push({
    CoinConfigID: '',
    CoinValue: '',
    CoinPreUSD: ''
  })
}

const removeInputGroup = (index: number) => {
  target.value.splice(index, 1)
}
</script>
