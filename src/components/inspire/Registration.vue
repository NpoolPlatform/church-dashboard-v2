<template>
  <q-table
    dense
    flat
    :title='$t("MSG_REGISTRATION")'
    :rows='displayRegistrations'
    row-key='ID'
    :rows-per-page-options='[10]'
  >
    <template #top-right>
      <div class='row indent flat'>
        <q-input
          dense
          flat
          class='small'
          v-model='username'
          :label='$t("MSG_USERNAME")'
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
import { NotifyType, Registration } from 'npool-cli-v4'
import { appID } from 'src/api/app'
import { useChurchRegistrationStore } from 'src/teststore/invitation/registration'
import { computed, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const registration = useChurchRegistrationStore()
const registrations = computed(() => registration.getRegistrationsByAppID(appID.value))

const username = ref('')
const displayRegistrations = computed(() => registrations.value.filter((el) => {
  const _username = username.value.toLowerCase()
  return el.InviteeEmailAddress.toLowerCase().includes(_username) || el.InviteePhoneNO.toLowerCase().includes(_username)
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
