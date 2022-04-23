<template>
  <q-table
    dense
    flat
    :title='$t("MSG_GOOD_BENEFITS")'
    :rows='benefits'
    row-key='ID'
    :rows-per-page-options='[10]'
  />
</template>

<script setup lang='ts'>
import { useChurchBillingStore, NotificationType } from 'npool-cli-v2'
import { computed, onMounted } from 'vue'

const billing = useChurchBillingStore()
const benefits = computed(() => billing.PlatformBenefits)

onMounted(() => {
  billing.getPlatformBenefits({
    Message: {
      Error: {
        Title: 'MSG_GET_PLATFORM_BENEFITS',
        Message: 'MSG_GET_PLATFORM_BENEFITS_FAIL',
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, () => {
    // TODO
  })
})

</script>
