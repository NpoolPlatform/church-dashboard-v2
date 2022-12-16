<template>
  <q-toggle
    v-if='backing !== undefined'
    label='backup'
    color='green'
    v-model='backing'
    @update:model-value='$emit("update:backup", backing)'
  />
  <q-toggle
    v-if='blocking !== undefined'
    label='blocked'
    color='green'
    v-model='blocking'
    @update:model-value='$emit("update:blocked", blocking)'
  />
  <q-toggle
    v-if='activating !== undefined'
    label='active'
    color='green'
    v-model='activating'
    @update:model-value='$emit("update:active", activating)'
  />
  <q-toggle
    v-if='locking !== undefined'
    label='locked'
    color='green'
    v-model='locking'
    @update:model-value='$emit("update:locked", locking)'
  />
  <q-btn
    dense
    flat
    class='btn flat button'
    :label='$t("MSG_RESET")'
    @click='onReset'
  />
</template>
<script setup lang='ts'>
import { defineProps, toRef, ref, defineEmits } from 'vue'

interface Props {
  backup?: boolean | null | undefined;
  blocked?: boolean | null| undefined;
  active?: boolean | null | undefined;
  locked?: boolean | null | undefined;
}

const props = defineProps<Props>()
const backup = toRef(props, 'backup')
const blocked = toRef(props, 'blocked')
const active = toRef(props, 'active')
const locked = toRef(props, 'locked')

// eslint-disable-next-line func-call-spacing
const emit = defineEmits<{
  (e: 'update:backup', backup: boolean | null): void
  (e: 'update:blocked', blocked: boolean | null): void
  (e: 'update:active', active: boolean | null): void
  (e: 'update:locked', locked: boolean | null): void
}>()

const backing = ref(backup.value)
const blocking = ref(blocked.value)
const activating = ref(active.value)
const locking = ref(locked.value)

const onReset = () => {
  if (backup.value !== undefined) {
    backing.value = null
    emit('update:backup', null)
  }
  if (blocked.value !== undefined) {
    blocking.value = null
    emit('update:blocked', null)
  }
  if (active.value !== undefined) {
    activating.value = null
    emit('update:active', null)
  }
  if (locked.value !== undefined) {
    locking.value = null
    emit('update:locked', null)
  }
}
</script>
