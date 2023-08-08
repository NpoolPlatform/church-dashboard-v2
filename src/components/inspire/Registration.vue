<template>
  <q-table
    dense
    flat
    :title='$t("MSG_REGISTRATION")'
    :rows='displayRegistrations'
    row-key='ID'
    :rows-per-page-options='[100]'
  >
    <template #top-right>
      <div class='row indent flat'>
        <q-input
          dense
          flat
          class='small'
          v-model='invitee'
          :label='$t("MSG_INVITEE")'
        />
        <q-input
          dense
          flat
          class='small'
          v-model='inviter'
          :label='$t("MSG_INVITER")'
        />
      </div>
    </template>
  </q-table>
  <q-card>
    <q-card-section class='bg-primary text-white'>
      {{ $t('MSG_ADVERTISEMENT_POSITION') }}
    </q-card-section>
  </q-card>
</template>

<script setup lang='ts'>
import { NotifyType, Registration, useChurchRegistrationStore } from 'npool-cli-v4'
import { appID } from 'src/api/app'
import { computed, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const registration = useChurchRegistrationStore()
const registrations = computed(() => registration.getRegistrationsByAppID(appID.value))

const invitee = ref('')
const inviter = ref('')
const displayRegistrations = computed(() => registrations.value.filter((el) => {
  const _invitee = invitee.value.toLowerCase()
  const _inviter = inviter.value.toLowerCase()
  let display = true
  if (_invitee.length > 0 && _invitee.length > 0) {
    display = (el.InviteeEmailAddress.toLowerCase().includes(_invitee) || el.InviteePhoneNO.toLowerCase().includes(_invitee)) &&
      (el.InviterEmailAddress.toLowerCase().includes(_inviter) || el.InviterPhoneNO.toLowerCase().includes(_inviter))
    return display
  }

  if (_invitee.length > 0) {
    display = el.InviteeEmailAddress.toLowerCase().includes(_invitee) || el.InviteePhoneNO.toLowerCase().includes(_invitee)
    return display
  }
  if (_inviter.length > 0) {
    display = el.InviterEmailAddress.toLowerCase().includes(_inviter) || el.InviterPhoneNO.toLowerCase().includes(_inviter)
    return display
  }

  return display
}))

watch(appID, () => {
  if (registrations.value.length === 0) {
    getAppRegistrations(0, 500)
  }
})

onMounted(() => {
  if (registrations.value.length === 0) {
    getAppRegistrations(0, 500)
  }
})

const getAppRegistrations = (offset: number, limit: number) => {
  registration.getAppRegistrations({
    TargetAppID: appID.value,
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: t('MSG_GET_REGISTRATIONS_FAIL'),
        Popup: true,
        Type: NotifyType.Error
      }
    }
  }, (error: boolean, rows: Array<Registration>) => {
    if (error || rows.length < limit) {
      return
    }
    getAppRegistrations(offset + limit, limit)
  })
}
</script>
