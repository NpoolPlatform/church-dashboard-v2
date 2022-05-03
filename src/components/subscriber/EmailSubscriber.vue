<template>
  <q-table
    dense
    flat
    :title='$t("MSG_EMAIL_SUBSCRIBERS")'
    :rows='subscribers'
    row-key='ID'
    :rows-per-page-options='[20]'
  />
</template>

<script setup lang='ts'>
import { Cond, NotificationType, useChurchSubscriberStore } from 'npool-cli-v2'
import { useLocalApplicationStore } from 'src/localstore'
import { computed, onMounted, watch } from 'vue'

const app = useLocalApplicationStore()
const appID = computed(() => app.AppID)

const subscriber = useChurchSubscriberStore()
const subscribers = computed(() => subscriber.EmailSubscribers.get(appID.value) ? subscriber.EmailSubscribers.get(appID.value) : [])

const prepare = () => {
  subscriber.getEmailSubscribers({
    TargetAppID: appID.value,
    Conds: new Map<string, Cond>(),
    Message: {
      Error: {
        Title: 'MSG_GET_EMAIL_SUBSCRIBERS',
        Message: 'MSG_GET_EMAIL_SUBSCRIBERS_FAIL',
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, () => {
    // TODO
  })
}

watch(appID, () => {
  prepare()
})

onMounted(() => {
  prepare()
})

</script>
