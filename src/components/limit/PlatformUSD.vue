<template>
  <q-card flat>
    <q-card-section>
      <q-input v-model='psetting.PaymentAccountUSDAmount' :label='$t("MSG_PAYMENT_ACCOUNT_USD_AMOUNT")' suffix='USD' />
      <q-input v-model='psetting.WarmAccountUSDAmount' :label='$t("MSG_WARM_ACCOUNT_USD_AMOUNT")' suffix='USD' />
      <q-input v-model='psetting.WithdrawAutoReviewUSDAmount' :label='$t("MSG_WITHDRAW_AUTO_REVIEW_USD_AMOUNT")' suffix='USD' />
      <q-btn class='btn' :label='$t("MSG_SUBMIT")' @click='onSubmit' />
    </q-card-section>
  </q-card>
</template>

<script setup lang='ts'>
import { usePlatformSettingStore, NotificationType, PlatformSetting } from 'npool-cli-v2'
import { computed, onMounted } from 'vue'

const setting = usePlatformSettingStore()
const psetting = computed({
  get: () => setting.PlatformSetting ? setting.PlatformSetting : {} as unknown as PlatformSetting,
  set: (val) => {
    setting.PlatformSetting = val
  }
})

onMounted(() => {
  setting.getPlatformSetting({
    Message: {
      Error: {
        Title: 'MSG_GET_PLATFORM_SETTING',
        Message: 'MSG_GET_PLATFORM_SETTING_FAIL',
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, () => {
    // TODO
  })
})

const onSubmit = () => {
  if (psetting.value.ID) {
    setting.updatePlatformSetting({
      Info: psetting.value,
      Message: {
        Error: {
          Title: 'MSG_UPDATE_PLATFORM_SETTING',
          Message: 'MSG_UPDATE_PLATFORM_SETTING_FAIL',
          Popup: true,
          Type: NotificationType.Error
        }
      }
    }, () => {
      // TODO
    })
    return
  }
  setting.createPlatformSetting({
    Info: psetting.value,
    Message: {
      Error: {
        Title: 'MSG_CREATE_PLATFORM_SETTING',
        Message: 'MSG_CREATE_PLATFORM_SETTING_FAIL',
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, () => {
    // TODO
  })
}

</script>
