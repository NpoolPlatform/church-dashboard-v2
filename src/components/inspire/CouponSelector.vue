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
  />
</template>
<script setup lang='ts'>
import { coupon, sdk } from 'src/npoolstore'
import { AppID } from 'src/npoolstore/sdk'
import { computed, defineEmits, defineProps, toRef, ref, onMounted, watch } from 'vue'

interface Props {
    id: string
    updating?: boolean
}

const props = defineProps<Props>()
const _id = toRef(props, 'id')
const updating = toRef(props, 'updating')

const _coupon = coupon.useCouponStore()
const myCoupons = computed(() => _coupon.coupons().filter((el) => el.CouponType !== coupon.CouponType.SpecialOffer && _coupon.valid(undefined, el.ID)))
const coupons = computed(() => myCoupons.value.map((el) => {
  return {
    value: el.ID,
    label: `${el.ID} | ${el.Name} | ${el.CouponType} | ${el.Denomination} | ${el.CouponScope}`
  }
}))
const displayCoupons = ref(coupons.value)
const target = ref(_id.value)

const onFilter = (val: string, doneFn: (callbackFn: () => void) => void) => {
  doneFn(() => {
    displayCoupons.value = coupons.value.filter((el) => {
      return el?.label?.toLowerCase().includes(val.toLowerCase())
    })
  })
}

const emit = defineEmits<{(e: 'update:id', id: string): void}>()
const onUpdate = () => {
  emit('update:id', target.value)
}

watch(AppID, () => {
  if (coupons.value.length === 0) {
    sdk.getAppCoupons(0, 0)
  }
})

onMounted(() => {
  if (coupons.value.length === 0) {
    sdk.getAppCoupons(0, 0)
  }
})
</script>
