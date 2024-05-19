<template>
  <q-select
    :disable='!updating ? false : true'
    v-model='target'
    :options='displayRootUsers'
    options-selected-class='text-deep-orange'
    emit-value
    label='MSG_ROOTUSERS'
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
import { miningpoolrootuser, notify } from 'src/npoolstore'

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

const rootuserInfo = miningpoolrootuser.useMiningpoolRootUserStore()
const rootusers = computed(() => Array.from(rootuserInfo.rootusers()).map((el) => {
  return {
    value: el.EntID,
    label: `${el.Name} | ${el.MiningpoolType} | ${el.EntID}`
  }
}))

const displayRootUsers = ref(rootusers.value)

const onFilter = (val: string, doneFn: (callbackFn: () => void) => void) => {
  doneFn(() => {
    displayRootUsers.value = rootusers.value.filter((el) => {
      return el?.label?.toLowerCase().includes(val.toLowerCase())
    })
  })
}

const emit = defineEmits<{(e: 'update:id', id: string): void}>()
const onUpdate = () => {
  emit('update:id', target.value)
}

const getRootUsers = (offset: number, limit: number) => {
  rootuserInfo.getRootUsers({
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: t('MSG_ADMIN_GET_ROOTUSERS'),
        Message: t('MSG_ADMIN_GET_ROOTUSER_FAIL'),
        Popup: true,
        Type: notify.NotifyType.Error
      }
    }
  }, (error: boolean, rootusers?: Array<miningpoolrootuser.RootUser>) => {
    if (error || !rootusers?.length) {
      console.log('get rootusers end')
    }
  })
}

onMounted(() => {
  if (!rootusers.value?.length) {
    getRootUsers(0, 0)
  }
})

</script>
