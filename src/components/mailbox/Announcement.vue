<template>
  <q-table
    dense
    flat
    :title='$t("MSG_MAILS")'
    :rows='announcements'
    row-key='ID'
    :loading='loading'
    :rows-per-page-options='[10]'
    @row-click='(evt, row, index) => onRowClick(row as Announcement)'
  >
    <template #top-right>
      <div class='row indent flat'>
        <q-btn
          dense
          flat
          class='btn flat'
          :label='$t("MSG_CREATE")'
          @click='onCreate'
        />
      </div>
    </template>
  </q-table>
  <q-dialog
    v-model='showing'
    @hide='onMenuHide'
    position='right'
  >
    <q-card class='popup-menu'>
      <q-card-section>
        <span>{{ $t('MSG_CREATE_COUNTRY') }}</span>
      </q-card-section>
      <q-card-section>
        <q-input v-model='target.Title' :label='$t("MSG_TITLE")' />
        <q-input v-model='target.Content' :label='$t("MSG_CONTENT")' />
      </q-card-section>
      <q-item class='row'>
        <q-btn class='btn round alt' :label='$t("MSG_SUBMIT")' @click='onSubmit' />
        <q-btn class='btn round' :label='$t("MSG_CANCEL")' @click='onCancel' />
      </q-item>
    </q-card>
  </q-dialog>
</template>

<script setup lang='ts'>
import { useChurchMailboxStore, NotificationType, Announcement, useAdminMailboxStore } from 'npool-cli-v2'
import { computed, onMounted, watch, ref } from 'vue'
import { useLocalApplicationStore } from '../../localstore'
import { useI18n } from 'vue-i18n'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const app = useLocalApplicationStore()
const appID = computed(() => app.AppID)

const mailbox = useChurchMailboxStore()
const amailbox = useAdminMailboxStore()
const announcements = computed(() => mailbox.Announcements.get(appID.value) ? mailbox.Announcements.get(appID.value) : [])
const loading = ref(true)

const prepare = () => {
  loading.value = true
  mailbox.getAnnouncements({
    TargetAppID: appID.value,
    Message: {
      Error: {
        Title: t('MSG_GET_ANNOUNCEMENTS'),
        Message: t('MSG_GET_ANNOUNCEMENTS_FAIL'),
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, () => {
    loading.value = false
  })
}

watch(appID, () => {
  prepare()
})

onMounted(() => {
  prepare()
})

const showing = ref(false)
const updating = ref(false)
const target = ref({} as unknown as Announcement)

const onCreate = () => {
  showing.value = true
  updating.value = false
}

const onRowClick = (announcement: Announcement) => {
  showing.value = true
  updating.value = true
  target.value = announcement
}

const onMenuHide = () => {
  showing.value = false
  target.value = {} as unknown as Announcement
}

const onSubmit = () => {
  showing.value = false

  if (updating.value) {
    amailbox.updateAnnouncement({
      Info: target.value,
      Message: {
        Error: {
          Title: 'MSG_UPDATE_ANNOUNCEMENT',
          Message: 'MSG_UPDATE_ANNOUNCEMENT_FAIL',
          Popup: true,
          Type: NotificationType.Error
        }
      }
    }, () => {
      // TODO
    })
    return
  }

  mailbox.createAnnouncement({
    TargetAppID: appID.value,
    Info: target.value,
    Message: {
      Error: {
        Title: 'MSG_CREATE_ANNOUNCEMENT',
        Message: 'MSG_CREATE_ANNOUNCEMENT_FAIL',
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, () => {
    // TODO
  })
}

const onCancel = () => {
  showing.value = false
}

</script>
