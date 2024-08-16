<template>
  <q-select
    :disable='!updating ? false : true'
    v-model='target'
    :options='displayUsers'
    options-selected-class='text-deep-orange'
    emit-value
    label='MSG_USERS'
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
import { user, sdk } from 'src/npoolstore'
import { computed, defineEmits, defineProps, toRef, ref, onMounted, watch } from 'vue'

interface Props {
  userId: string
  updating?: boolean
}

const props = defineProps<Props>()
const id = toRef(props, 'userId')
const updating = toRef(props, 'updating')
const target = ref(id.value)

const _user = user.useUserStore()
const users = computed(() => Array.from(_user.appUsers(undefined)).map((el) => {
  return {
    value: el.EntID,
    label: `${el.EmailAddress} | ${el.PhoneNO} | ${el.EntID}`
  }
}))

const displayUsers = ref(users.value)
const onFilter = (val: string, doneFn: (callbackFn: () => void) => void) => {
  doneFn(() => {
    displayUsers.value = users.value.filter((el) => {
      return el?.label?.toLowerCase().includes(val.toLowerCase())
    })
  })
}

const emit = defineEmits<{(e: 'update:userId', id: string): void}>()
const onUpdate = () => {
  emit('update:userId', target.value)
}

watch(sdk.AppID, () => {
  if (!users.value?.length) {
    sdk.adminGetUsers(0, 0)
  }
})
onMounted(() => {
  if (!users.value?.length) {
    sdk.adminGetUsers(0, 0)
  }
})
</script>
