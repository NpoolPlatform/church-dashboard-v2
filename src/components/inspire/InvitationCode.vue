<template>
  <q-table
    dense
    flat
    :title='$t("MSG_INVITATION_CODES")'
    :rows='displayCodes'
    row-key='ID'
    :rows-per-page-options='[100]'
    :columns='invitationCodeColumns'
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
</template>

<script setup lang='ts'>
import { computed, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { invitationcode, utils, sdk } from 'src/npoolstore'

const AppID = sdk.AppID

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const code = invitationcode.useInvitationCodeStore()
const codes = computed(() => code.invitationCodes(AppID.value))

const _code = ref('')
const displayCodes = computed(() => codes.value.filter((el) => {
  return el.EmailAddress?.includes(_code.value) || el.InvitationCode?.includes(_code.value) || el.PhoneNO?.includes(_code.value)
}))

watch(AppID, () => {
  if (codes.value.length === 0) {
    getAppInvitationCodes(0, 100)
  }
})

onMounted(() => {
  if (codes.value?.length === 0) {
    getAppInvitationCodes(0, 100)
  }
})

const getAppInvitationCodes = (offset: number, limit: number) => {
  code.getAppInvitationCodes({
    TargetAppID: AppID.value,
    Offset: offset,
    Limit: limit,
    Message: {}
  }, (error: boolean, rows: Array<invitationcode.InvitationCode>) => {
    if (error) {
      return
    }
    if (!rows.length) {
      return
    }
    getAppInvitationCodes(offset + limit, limit)
  })
}

const invitationCodeColumns = computed(() => [
  {
    name: 'ID',
    label: t('MSG_ID'),
    field: (row: invitationcode.InvitationCode) => row.ID
  },
  {
    name: 'EntID',
    label: t('MSG_ENT_ID'),
    field: (row: invitationcode.InvitationCode) => row.EntID
  },
  {
    name: 'AppID',
    label: t('MSG_APP_ID'),
    sortable: true,
    field: (row: invitationcode.InvitationCode) => row.AppID
  },
  {
    name: 'UserID',
    label: t('MSG_USER_ID'),
    sortable: true,
    field: (row: invitationcode.InvitationCode) => row.UserID
  },
  {
    name: 'Username',
    label: t('MSG_USERNAME'),
    sortable: true,
    field: (row: invitationcode.InvitationCode) => row.Username
  },
  {
    name: 'EmailAddress',
    label: t('MSG_EMAIL_ADDRESS'),
    sortable: true,
    field: (row: invitationcode.InvitationCode) => row.EmailAddress
  },
  {
    name: 'PhoneNO',
    label: t('MSG_PHONE_NO'),
    sortable: true,
    field: (row: invitationcode.InvitationCode) => row.PhoneNO
  },
  {
    name: 'InvitationCode',
    label: t('MSG_INVITATION_CODE'),
    sortable: true,
    field: (row: invitationcode.InvitationCode) => row.InvitationCode
  },
  {
    name: 'Disabled',
    label: t('MSG_DISABLED'),
    sortable: true,
    field: (row: invitationcode.InvitationCode) => row.Disabled
  },
  {
    name: 'CreatedAt',
    label: t('MSG_CREATED_AT'),
    sortable: true,
    field: (row: invitationcode.InvitationCode) => utils.formatTime(row.CreatedAt)
  },
  {
    name: 'UpdatedAt',
    label: t('MSG_UPDATED_AT'),
    sortable: true,
    field: (row: invitationcode.InvitationCode) => utils.formatTime(row.UpdatedAt)
  }
])
</script>
