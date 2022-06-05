<template>
  <q-table
    v-if='!csetting?.UniqueSetting'
    dense
    flat
    :title='$t("MSG_USERS")'
    :rows='displayUsers'
    row-key='ID'
    :rows-per-page-options='[10]'
    selection='single'
    v-model:selected='selectedUser'
  >
    <template #top-right>
      <div class='row indent flat'>
        <q-input
          dense
          class='small'
          v-model='username'
          :label='$t("MSG_USERNAME")'
        />
        <q-btn
          dense
          flat
          class='btn flat'
          :label='$t("MSG_CREATE")'
          @click='onCreate'
          :disable='selectedUser.length === 0'
        />
      </div>
    </template>
  </q-table>
  <q-table
    dense
    flat
    :title='$t("MSG_PURCHASE_AMOUNT_SETTINGS")'
    :rows='settings'
    row-key='ID'
    :rows-per-page-options='[10]'
  />
  <q-dialog
    v-model='showing'
    @hide='onMenuHide'
    position='right'
  >
    <q-card class='popup-menu'>
      <q-card-section>
        <span>{{ $t('MSG_CREATE_PURCHASE_AMOUNT_SETTING') }}</span>
      </q-card-section>
      <q-card-section>
        <span>
          {{ $t('MSG_USERNAME') }}: {{ selectedUser[0]?.EmailAddress?.length ? selectedUser[0]?.EmailAddress : selectedUser[0]?.PhoneNO }}
        </span>
      </q-card-section>
      <q-card-section>
        <q-input type='number' v-model='target.Amount' :label='$t("MSG_AMOUNT")' :suffix='PriceCoinName' />
        <q-input v-model='target.BadgeLarge' :label='$t("MSG_BADGE_LARGE")' />
        <q-input v-model='target.BadgeSmall' :label='$t("MSG_BADGE_SMALL")' />
        <q-input
          type='number'
          v-model='target.Percent'
          :label='$t("MSG_PERCENT")'
        />
        <q-input type='date' v-model='start' :label='$t("MSG_START")' />
        <q-input type='date' v-model='end' :label='$t("MSG_END")' />
        <q-input v-model='target.Title' :label='$t("MSG_TITLE")' />
      </q-card-section>
      <q-item class='row'>
        <q-btn class='btn round alt' :label='$t("MSG_SUBMIT")' @click='onSubmit' />
        <q-btn class='btn round' :label='$t("MSG_CANCEL")' @click='onCancel' />
      </q-item>
    </q-card>
  </q-dialog>
</template>

<script setup lang='ts'>
import {
  useChurchPurchaseAmountSettingStore,
  NotificationType,
  PurchaseAmountSetting,
  useChurchUsersStore,
  AppUser,
  useChurchCommissionStore,
  PriceCoinName,
  formatTime,
  InvalidID
} from 'npool-cli-v2'
import { useLocalApplicationStore } from 'src/localstore'
import { computed, onMounted, watch, ref } from 'vue'
import { useI18n } from 'vue-i18n'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const app = useLocalApplicationStore()
const appID = computed(() => app.AppID)

interface MySetting extends PurchaseAmountSetting {
  EmailAddress: string
  PhoneNO: string
}

const user = useChurchUsersStore()
const commission = useChurchCommissionStore()
const csetting = computed(() => commission.CommissionSettings.get(appID.value))

const setting = useChurchPurchaseAmountSettingStore()
const appSettings = computed(() => {
  const s = setting.PurchaseAmountSettings.get(appID.value)
  if (!s) {
    return [] as Array<PurchaseAmountSetting>
  }
  return s
})
const settings = computed(() => Array.from(appSettings.value).map((el) => {
  const s = el as MySetting
  s.EmailAddress = user.getUserByAppUserID(appID.value, s.UserID)?.User.EmailAddress as string
  s.PhoneNO = user.getUserByAppUserID(appID.value, s.UserID)?.User.PhoneNO as string
  return s
}))

const users = computed(() => {
  const appUsers = user.Users.get(appID.value)
  if (!appUsers) {
    return [] as Array<AppUser>
  }
  return Array.from(appUsers).map((el) => el.User)
})
const username = ref('')
const displayUsers = computed(() => users.value.filter((el) => {
  return el.EmailAddress?.includes(username.value) || el.PhoneNO?.includes(username.value)
}))
const selectedUser = ref([] as Array<AppUser>)
const userID = computed(() => selectedUser.value.length > 0 ? selectedUser.value[0].ID : InvalidID)

const prepare = () => {
  setting.getPurchaseAmountSettings({
    TargetAppID: appID.value,
    Message: {
      Error: {
        Title: t('MSG_GET_PURCHASE_AMOUNT_SETTINGS'),
        Message: t('MSG_GET_PURCHASE_AMOUNT_SETTINGS_FAIL'),
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, () => {
    // TODO
  })

  user.getUsers({
    TargetAppID: appID.value,
    Message: {
      Error: {
        Title: t('MSG_GET_USERS'),
        Message: t('MSG_GET_USERS_FAIL'),
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, () => {
    // TODO
  })

  commission.getCommissionSetting({
    TargetAppID: appID.value,
    Message: {
      Error: {
        Title: t('MSG_GET_COMMISSION_SETTING'),
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

const showing = ref(false)
const target = ref({} as unknown as PurchaseAmountSetting)
watch(userID, () => {
  target.value.UserID = userID.value as string
})
const start = computed({
  get: () => formatTime(target.value.Start, true)?.replace(/\//g, '-'),
  set: (val) => {
    target.value.Start = new Date(val).getTime() / 1000
  }
})
const end = computed({
  get: () => formatTime(target.value.End, true)?.replace(/\//g, '-'),
  set: (val) => {
    target.value.End = new Date(val).getTime() / 1000
  }
})

const onCreate = () => {
  showing.value = true
}

const onMenuHide = () => {
  showing.value = false
  target.value = {} as unknown as PurchaseAmountSetting
}

const onSubmit = () => {
  showing.value = false
  if (csetting.value?.UniqueSetting) {
    setting.createPurchaseAmountSetting({
      TargetAppID: appID.value,
      Info: target.value,
      Message: {
        Error: {
          Title: t('MSG_CREATE_PURCHASE_AMOUNT_SETTING'),
          Message: t('MSG_CREATE_PURCHASE_AMOUNT_SETTING_FAIL'),
          Popup: true,
          Type: NotificationType.Error
        }
      }
    }, () => {
      // TODO
    })
    return
  }
  setting.createUserPurchaseAmountSetting({
    TargetAppID: appID.value,
    TargetUserID: userID.value as string,
    Info: target.value,
    Message: {
      Error: {
        Title: t('MSG_CREATE_PURCHASE_AMOUNT_SETTING'),
        Message: t('MSG_CREATE_PURCHASE_AMOUNT_SETTING_FAIL'),
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, () => {
    // TODO
  })
}

const onCancel = () => {
  onMenuHide()
}

</script>
