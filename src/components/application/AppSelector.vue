<template>
  <q-select
    :disable='!updating ? false : true'
    v-model='target'
    :options='displayApplications'
    options-selected-class='text-deep-orange'
    emit-value
    label='MSG_APPS'
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
  appId: string
  updating?: boolean
}

const props = defineProps<Props>()
const appId = toRef(props, 'appId')
const updating = toRef(props, 'updating')
const target = ref(appId.value)

const apps = sdk.applications
const applications = computed(() => apps.value.map((el) => {
  return {
    value: el.EntID,
    label: `${el.Name} | ${el.EntID}`
  }
}))
const displayApplications = ref(applications.value)

const onFilter = (val: string, doneFn: (callbackFn: () => void) => void) => {
  doneFn(() => {
    displayApplications.value = applications.value.filter((el) => {
      return el?.label?.toLowerCase().includes(val.toLowerCase())
    })
  })
}

const emit = defineEmits<{(e: 'update:appId', appId: string): void}>()
const onUpdate = () => {
  emit('update:appId', target.value)
}

onMounted(() => {
  if (!apps.value.length) {
    sdk.getApplications(0, 0)
  }
})
</script>
