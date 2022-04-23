<template>
  <q-table
    dense
    flat
    :title='$t("MSG_GOOD_USER_BENEFITS")'
    :rows='benefits'
    row-key='ID'
    :rows-per-page-options='[10]'
  />
</template>

<script setup lang='ts'>
import { useChurchBillingStore, NotificationType } from 'npool-cli-v2'
import { useLocalApplicationStore } from 'src/localstore'
import { computed, onMounted, watch } from 'vue'

const app = useLocalApplicationStore()
const appID = computed(() => app.AppID)

const billing = useChurchBillingStore()
const benefits = computed(() => billing.UserBenefits.get(appID.value) ? billing.UserBenefits.get(appID.value) : [])

const prepare = () => {
  billing.getUserBenefits({
    TargetAppID: appID.value,
    Message: {
      Error: {
        Title: 'MSG_GET_USER_BENEFITS',
        Message: 'MSG_GET_USER_BENEFITS_FAIL',
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
