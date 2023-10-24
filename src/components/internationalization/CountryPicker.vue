<template>
  <q-select
    :disable='!updating ? false : true'
    v-model='target'
    :options='displayCountries'
    options-selected-class='text-deep-orange'
    emit-value
    :label='myLabel'
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
import { getCountries } from 'src/api/g11n'
import { computed, defineEmits, defineProps, toRef, ref, onMounted } from 'vue'
import { country } from 'src/npoolstore'

interface Props {
  id: string
  updating?: boolean
  label?: string,
}

const props = defineProps<Props>()
const id = toRef(props, 'id')
const updating = toRef(props, 'updating')
const label = toRef(props, 'label')

const myLabel = computed(() => {
  return !label.value ? 'MSG_COUNTRIES' : label.value
})

const target = ref(id.value)

const _country = country.useCountryStore()
const countries = computed(() => Array.from(_country.countries()).map((el) => {
  return {
    value: el.EntID,
    label: `${el.Country} | ${el.Short}`
  }
}))
const displayCountries = ref(countries.value)

const onFilter = (val: string, doneFn: (callbackFn: () => void) => void) => {
  doneFn(() => {
    displayCountries.value = countries.value.filter((el) => {
      return el?.label?.toLowerCase().includes(val.toLowerCase())
    })
  })
}

const emit = defineEmits<{(e: 'update:id', id: string): void}>()
const onUpdate = () => {
  emit('update:id', target.value)
}

onMounted(() => {
  if (!countries.value.length) {
    getCountries(0, 100)
  }
})
</script>
