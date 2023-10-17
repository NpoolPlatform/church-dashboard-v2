<template>
  <q-select
    :disable='!updating ? false : true'
    v-model='target'
    :options='displayFiats'
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
import { computed, defineEmits, defineProps, toRef, ref, onMounted } from 'vue'
import { fiat } from 'src/npoolstore'

interface Props {
  id: string
  updating?: boolean
  label?: string,
  getData?: boolean
}

const props = defineProps<Props>()
const id = toRef(props, 'id')
const updating = toRef(props, 'updating')
const label = toRef(props, 'label')

const myLabel = computed(() => {
  return !label.value ? 'MSG_FiatS' : label.value
})

const target = ref(id.value)

const _fiat = fiat.useFiatStore()
const fiats = computed(() => Array.from(_fiat.fiats()).map((el) => {
  return {
    value: el.ID,
    label: `${el.Name} | ${el.ID}`
  }
}))
const displayFiats = ref(fiats.value)

const onFilter = (val: string, doneFn: (callbackFn: () => void) => void) => {
  doneFn(() => {
    displayFiats.value = fiats.value.filter((el) => {
      return el?.label?.toLowerCase().includes(val.toLowerCase())
    })
  })
}

const emit = defineEmits<{(e: 'update:id', id: string): void}>()
const onUpdate = () => {
  emit('update:id', target.value)
}

onMounted(() => {
  if (!fiats.value.length) {
    getFiats(0, 100)
  }
})

const getFiats = (offset: number, limit: number) => {
  _fiat.getFiats({
    Offset: offset,
    Limit: limit,
    Message: {}
  }, (error: boolean, rows?: fiat.Fiat[]) => {
    if (error || !rows?.length) {
      return
    }
    getFiats(offset + limit, limit)
  })
}

</script>
