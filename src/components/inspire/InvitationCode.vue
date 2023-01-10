<template>
  <q-table
    dense
    flat
    :title='$t("MSG_INVITATION_CODES")'
    :rows='displayCodes'
    row-key='ID'
    :rows-per-page-options='[20]'
  >
    <template #top-right>
      <div class='row indent flat'>
        <q-input
          dense
          flat
          class='small'
          v-model='_code'
          :label='$t("MSG_SEARCH")'
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
import { InvitationCode, useChurchInvitationCodeStore } from 'npool-cli-v4'
import { appID } from 'src/api/app'
import { computed, onMounted, ref, watch } from 'vue'

const code = useChurchInvitationCodeStore()
const codes = computed(() => code.getInvitationCodesByAppID(appID.value))

const _code = ref('')
const displayCodes = computed(() => codes.value.filter((el) => {
  return el.EmailAddress?.includes(_code.value) || el.InvitationCode?.includes(_code.value) || el.PhoneNO?.includes(_code.value)
}))

watch(appID, () => {
  if (codes.value.length === 0) {
    getAppInvitationCodes(0, 500)
  }
})

onMounted(() => {
  if (codes.value?.length === 0) {
    getAppInvitationCodes(0, 500)
  }
})

const getAppInvitationCodes = (offset: number, limit: number) => {
  code.getAppInvitationCodes({
    TargetAppID: appID.value,
    Offset: offset,
    Limit: limit,
    Message: {}
  }, (error: boolean, rows: Array<InvitationCode>) => {
    if (error || rows.length < limit) {
      return
    }
    getAppInvitationCodes(offset + limit, limit)
  })
}
</script>
