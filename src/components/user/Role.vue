<template>
  <q-table
    dense
    flat
    :title='$t("MSG_ROLES")'
    :rows='roles'
    row-key='ID'
    :loading='roleLoading'
    :rows-per-page-options='[20]'
  />
  <q-card>
    <q-card-section class='bg-primary text-white'>
      {{ $t('MSG_ADVERTISEMENT_POSITION') }}
    </q-card-section>
  </q-card>
</template>

<script setup lang='ts'>
import { NotificationType, useChurchRolesStore } from 'npool-cli-v2'
import { useLocalApplicationStore } from 'src/localstore'
import { computed, onMounted, ref, watch } from 'vue'

const app = useLocalApplicationStore()
const appID = computed(() => app.AppID)

const role = useChurchRolesStore()
const roles = computed(() => role.Roles.get(appID.value) ? role.Roles.get(appID.value) : [])
const roleLoading = ref(true)

const prepare = () => {
  roleLoading.value = true
  role.getRoles({
    TargetAppID: appID.value,
    Message: {
      Error: {
        Title: 'MSG_GET_ROLES',
        Message: 'MSG_GET_ROLES_FAIL',
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, () => {
    roleLoading.value = false
  })
}

watch(appID, () => {
  prepare()
})

onMounted(() => {
  prepare()
})

</script>
