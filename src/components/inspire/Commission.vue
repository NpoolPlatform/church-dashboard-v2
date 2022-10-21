<template>
  <div class='main'>
    <q-select :options='CommissionTypes' v-model='setting.Type' :label='$t("MSG_COMMISSION_TYPE")' />
    <div>
      <q-toggle dense v-model='setting.InvitationDiscount' :label='$t("MSG_ENABLE_INVITATION_DISCOUNT")' />
    </div>
    <div>
      <q-toggle dense v-model='setting.KPISetting' :label='$t("MSG_ENABLE_KPI_SETTING")' />
    </div>
    <div>
      <q-toggle dense v-model='setting.UniqueSetting' :label='$t("MSG_ENABLE_UNIQUE_SETTING")' />
    </div>
    <q-input type='number' v-model='setting.Level' :label='$t("MSG_COMMISSION_LEVEL")' />
    <q-btn class='btn' :label='$t("MSG_SUBMIT")' @click='onSubmit' />
  </div>
</template>

<script setup lang='ts'>
import { useChurchCommissionStore, CommissionTypes, CommissionSetting, NotificationType } from 'npool-cli-v2'
import { useLocalApplicationStore } from 'src/localstore'
import { computed, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const app = useLocalApplicationStore()
const appID = computed(() => app.AppID)

const commission = useChurchCommissionStore()
const appSetting = computed(() => commission.CommissionSettings.get(appID.value))
const setting = computed({
  get: () => appSetting.value ? appSetting.value : {} as CommissionSetting,
  set: (val) => {
    commission.CommissionSettings.set(appID.value, val)
  }
})

const prepare = () => {
  commission.getCommissionSetting({
    TargetAppID: appID.value,
    Message: {
      Error: {
        Title: t('MSG_GET_COMMISSION_SETTINGE'),
        Message: t('MSG_GET_COMMISSION_SETTING_FAIL'),
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

const onSubmit = () => {
  if (setting.value.ID) {
    commission.updateCommissionSetting({
      Info: setting.value,
      Message: {
        Error: {
          Title: t('MSG_UPDATE_COMMISSION_SETTING'),
          Message: t('MSG_UPDATE_COMMISSION_SETTING_FAIL'),
          Popup: true,
          Type: NotificationType.Error
        },
        Info: {
          Title: t('MSG_UPDATE_COMMISSION_SETTING'),
          Message: t('MSG_UPDATE_COMMISSION_SETTING_SUCCESS'),
          Popup: true,
          Type: NotificationType.Success
        }
      }
    }, () => {
      // TODO
    })
    return
  }
  commission.createCommissionSetting({
    TargetAppID: appID.value,
    Info: setting.value,
    Message: {
      Error: {
        Title: t('MSG_CREATE_COMMISSION_SETTING'),
        Message: t('MSG_CREATE_COMMISSION_SETTING_FAIL'),
        Popup: true,
        Type: NotificationType.Error
      },
      Info: {
        Title: t('MSG_CREATE_COMMISSION_SETTING'),
        Message: t('MSG_CREATE_COMMISSION_SETTING_SUCCESS'),
        Popup: true,
        Type: NotificationType.Success
      }
    }
  }, () => {
    // TODO
  })
}

</script>
