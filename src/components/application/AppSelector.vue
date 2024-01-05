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
import { app, notify } from 'src/npoolstore'

interface Props {
  id: string
  updating?: boolean
}

const props = defineProps<Props>()
const id = toRef(props, 'id')
const updating = toRef(props, 'updating')
const target = ref(id.value)

const application = app.useApplicationStore()
const applications = computed(() => application.apps().map((el) => {
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

const emit = defineEmits<{(e: 'update:id', id: string): void}>()
const onUpdate = () => {
  emit('update:id', target.value)
}

onMounted(() => {
  if (!application.apps().length) {
    getApps(0, 100)
  }
})

const getApps = (offset: number, limit: number) => {
  application.getApps({
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: 'MSG_GET_APPS',
        Message: 'MSG_GET_APPS_FAIL',
        Popup: true,
        Type: notify.NotifyType.Error
      }
    }
  }, (error: boolean, apps?: Array<app.App>) => {
    if (error || !apps?.length) {
      return
    }
    getApps(offset + limit, limit)
  })
}
</script>
