<template>
  <q-select
    v-model='target'
    :options='displayPowerRentals'
    options-selected-class='text-deep-orange'
    emit-value
    label='MSG_POSER_RENTALS'
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
  goodId: string | undefined
}

const props = defineProps<Props>()
const goodId = toRef(props, 'goodId')
const target = ref(goodId.value)

const powerRentals = sdk.powerRentals
const _powerRentals = computed(() => Array.from(powerRentals.value, (el) => {
  return {
    value: el.EntID,
    label: `${el.EntID} | ${el.Name} | ${el.GoodType}`
  }
}))
const displayPowerRentals = ref(_powerRentals.value)

const onFilter = (val: string, doneFn: (callbackFn: () => void) => void) => {
  doneFn(() => {
    displayPowerRentals.value = _powerRentals.value.filter((el) => {
      return el.label.toLowerCase().includes(val.toLowerCase())
    })
  })
}

const emit = defineEmits<{(e: 'update:goodId', goodId: string | undefined): void}>()
const onUpdate = () => {
  emit('update:goodId', target.value)
}

onMounted(() => {
  if (powerRentals.value.length === 0) {
    sdk.getPowerRentals(0, 0)
  }
})
</script>
