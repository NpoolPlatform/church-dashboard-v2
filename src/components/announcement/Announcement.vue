<template>
  <div class='row announcement main'>
    <q-icon class='icon start' name='volume_up' />
    {{ announcement }}
  </div>
</template>

<script setup lang='ts'>
import { useMailboxStore, NotificationType } from 'npool-cli-v2'
import { ref, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const mailbox = useMailboxStore()
const announcement = ref('')
const index = ref(0)

const ticker = ref(-1)

onMounted(() => {
  ticker.value = window.setInterval(() => {
    if (mailbox.Announcements.length === 0) {
      return
    }

    index.value = index.value % mailbox.Announcements.length
    announcement.value = mailbox.Announcements[index.value].Title
    index.value += 1
  }, 3000)

  mailbox.getAnnouncements({
    Message: {
      Error: {
        Title: t('MSG_GET_ANNOUNCEMENTS'),
        Message: t('MSG_GET_ANNOUNCEMENTS_FAIL'),
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, () => {
    // TODO
  })
})

onUnmounted(() => {
  if (ticker.value >= 0) {
    window.clearInterval(ticker.value)
  }
})

</script>

<style lang='sass' scoped>
</style>
