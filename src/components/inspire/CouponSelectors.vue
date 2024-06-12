<template>
  <q-select
    :disable='!updating ? false : true'
    v-model='target'
    :options='displayCoupons'
    options-selected-class='text-deep-orange'
    emit-value
    label='MSG_COUPONS'
    map-options
    @update:model-value='onUpdate'
    use-input
    @filter='onFilter'
    multiple
  />
</template>
<script setup lang='ts'>
import { coupon } from 'src/npoolstore'
import { computed, defineEmits, defineProps, toRef, ref, onMounted } from 'vue'
import { getCoupons } from 'src/api/inspire'

interface Props {
  ids: string[]
  updating?: boolean
}

const props = defineProps<Props>()
const ids = toRef(props, 'ids')
const updating = toRef(props, 'updating')
const target = ref(ids.value)

const _coupon = coupon.useCouponStore()
const myCoupons = computed(() => _coupon.coupons().filter((el) => el.CouponType !== coupon.CouponType.SpecialOffer && _coupon.valid(undefined, el.ID)))
const coupons = computed(() => myCoupons.value.map((el) => {
  return {
    value: el.EntID,
    label: `${el.ID} | ${el.EntID} | ${el.Name} | ${el.CouponType} | ${el.Denomination}`
  }
}))
const displayCoupons = ref(coupons.value)

const onFilter = (val: string, doneFn: (callbackFn: () => void) => void) => {
  doneFn(() => {
    displayCoupons.value = coupons.value.filter((el) => {
      return el?.label?.toLowerCase().includes(val.toLowerCase())
    })
  })
}

const emit = defineEmits<{(e: 'update:ids', ids: string[]): void}>()
const onUpdate = () => {
  emit('update:ids', target.value)
}

onMounted(() => {
  if (coupons.value.length === 0) {
    getCoupons(0, 100)
  }
})
</script>
