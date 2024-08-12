<template>
  <div class='row announcement main'>
    <q-icon class='icon start' name='volume_up' />
    {{ _announcement }}
  </div>
</template>

<script setup lang='ts'>
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { announcement, notify, user, sdk } from 'src/npoolstore'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const mailbox = announcement.useAnnouncementStore()
const _announcement = ref('')
const announcements = computed(() => mailbox.announcements(sdk.MyAppID.value))
const index = ref(0)
const logined = user.useLocalUserStore()

const ticker = ref(-1)

watch(() => logined.logined, () => {
  if (logined.logined) {
    mailbox.getAnnouncements({
      Offset: 0,
      Limit: 100,
      Message: {
        Error: {
          Title: t('MSG_GET_ANNOUNCEMENTS'),
          Message: t('MSG_GET_ANNOUNCEMENTS_FAIL'),
          Popup: true,
          Type: notify.NotifyType.Error
        }
      }
    }, () => {
      // TODO
    })
  }
})

onMounted(() => {
  ticker.value = window.setInterval(() => {
    if (!announcements.value.length) {
      return
    }

    index.value = index.value % announcements.value.length
    _announcement.value = announcements.value[index.value].Title
    index.value += 1
  }, 3000)

  if (logined.logined) {
    mailbox.getAnnouncements({
      Offset: 0,
      Limit: 100,
      Message: {
        Error: {
          Title: t('MSG_GET_ANNOUNCEMENTS'),
          Message: t('MSG_GET_ANNOUNCEMENTS_FAIL'),
          Popup: true,
          Type: notify.NotifyType.Error
        }
      }
    }, () => {
      // TODO
    })
  }
})

onUnmounted(() => {
  if (ticker.value >= 0) {
    window.clearInterval(ticker.value)
  }
})

</script>

<style lang='sass' scoped>
</style>
