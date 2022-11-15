<template>
  <q-toggle
    label='backup'
    color='green'
    v-model='backing'
    @update:model-value='$emit("update:backup", backing)'
  />
  <q-toggle
    label='blocked'
    color='green'
    v-model='blocking'
    @update:model-value='$emit("update:blocked", blocking)'
  />
  <q-toggle
    label='active'
    color='green'
    v-model='activating'
    @update:model-value='$emit("update:active", activating)'
  />
  <q-toggle
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
  backup: boolean | null;
  blocked: boolean | null;
  active: boolean | null;
  locked: boolean | null;
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
  backing.value = null
  blocking.value = null
  activating.value = null
  locking.value = null
  emit('update:active', null)
  emit('update:backup', null)
  emit('update:locked', null)
  emit('update:blocked', null)
}
</script>
