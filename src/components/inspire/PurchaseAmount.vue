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
    :columns='columns'
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
    @row-click='(evt, row, index) => onRowClick(row as PurchaseAmountSetting)'
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
        <q-select :options='myGoods' v-model='selectedGood' :label='$t("MSG_GOOD")' />
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
  useChurchCommissionStore,
  PriceCoinName,
  formatTime,
  InvalidID
} from 'npool-cli-v2'
import { AppGood, NotifyType, useChurchAppGoodStore, useChurchUserStore, User } from 'npool-cli-v4'
import { useLocalApplicationStore } from 'src/localstore'
import { computed, onMounted, watch, ref } from 'vue'
import { useI18n } from 'vue-i18n'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })
const columns = computed(() => [
  {
    name: 'AppID',
    label: t('MSG_APP_ID'),
    field: (row: User) => row.AppID
  },
  {
    name: 'UserID',
    label: t('MSG_USER_ID'),
    field: (row: User) => row.ID
  },
  {
    name: 'EmailAddress',
    label: t('MSG_EMAIL_ADDRESS'),
    field: (row: User) => row.EmailAddress
  },
  {
    name: 'PhoneNO',
    label: t('MSG_PHONE_NO'),
    field: (row: User) => row.PhoneNO
  },
  {
    name: 'Roles',
    label: t('MSG_ROLES'),
    field: (row: User) => row.Roles.join(',')
  },
  {
    name: 'CreatedAt',
    label: t('MSG_CREATEDAT'),
    field: (row: User) => formatTime(row.CreatedAt)
  }
])
const app = useLocalApplicationStore()
const appID = computed(() => app.AppID)

interface MySetting extends PurchaseAmountSetting {
  EmailAddress: string
  PhoneNO: string
  GoodName: string
}

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
  s.EmailAddress = user.getUserByAppUserID(appID.value, s.UserID as string)?.EmailAddress
  s.PhoneNO = user.getUserByAppUserID(appID.value, s.UserID as string)?.PhoneNO
  s.GoodName = ''
  const index = goods.value.findIndex((gel) => gel.GoodID === el.GoodID)
  if (index >= 0) {
    s.GoodName = goods.value[index].GoodName
  }
  return s
}))

const user = useChurchUserStore()
const appUsers = computed(() => user.Users.get(appID.value) ? user.Users.get(appID.value) as Array<User> : [])
const username = ref('')
const displayUsers = computed(() => appUsers.value.filter((user) => user.EmailAddress?.includes(username.value) || user.PhoneNO?.includes(username.value)))

const selectedUser = ref([] as Array<User>)

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

  if (!user.Users.get(appID.value)) {
    getAppUsers(0, 500)
  }

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
const getAppUsers = (offset: number, limit: number) => {
  user.getAppUsers({
    TargetAppID: appID.value,
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: 'MSG_GET_USERS',
        Message: 'MSG_GET_USERS_FAIL',
        Popup: true,
        Type: NotifyType.Error
      }
    }
  }, (users: Array<User>, error: boolean) => {
    if (error || users.length < limit) {
      return
    }
    getAppUsers(offset + limit, limit)
  })
}
const good = useChurchAppGoodStore()
const goods = computed(() => good.getGoodsByAppID(appID.value))

interface MyGood {
  label: string
  value: AppGood
}
const myGoods = computed(() => Array.from(goods.value).map((el) => {
  return {
    label: el.GoodName + '(' + (el.GoodID) + ')',
    value: el
  } as MyGood
}))
const selectedGood = computed({
  get: () => {
    const index = goods.value.findIndex((el) => el.GoodID === target.value.GoodID)
    if (index < 0) {
      return undefined as unknown as MyGood
    }
    return {
      label: goods.value[index].GoodName + '(' + (goods.value[index].GoodID) + ')',
      value: goods.value[index]
    } as MyGood
  },
  set: (val: MyGood) => {
    target.value.GoodID = val.value.GoodID
  }
})

watch(appID, () => {
  prepare()
})

onMounted(() => {
  prepare()
  if (goods.value.length === 0) {
    getAppGoods(0, 500)
  }
})

const showing = ref(false)
const updating = ref(true)
const target = ref({} as unknown as PurchaseAmountSetting)

watch(userID, () => {
  target.value.UserID = userID.value
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
  updating.value = false
  target.value = {} as unknown as PurchaseAmountSetting
}

const onRowClick = (setting: PurchaseAmountSetting) => {
  showing.value = true
  updating.value = true
  target.value = setting
}

const onMenuHide = () => {
  showing.value = false
  target.value = {} as unknown as PurchaseAmountSetting
}

const onSubmit = () => {
  showing.value = false

  if (updating.value) {
    setting.updatePurchaseAmountSetting({
      Info: target.value,
      Message: {
        Error: {
          Title: t('MSG_UPDATE_PURCHASE_AMOUNT_SETTING'),
          Message: t('MSG_UPDATE_PURCHASE_AMOUNT_SETTING_FAIL'),
          Popup: true,
          Type: NotificationType.Error
        }
      }
    }, () => {
      // TODO
    })
    return
  }

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
    TargetUserID: userID.value,
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

const getAppGoods = (offset: number, limit: number) => {
  good.getAppGoods({
    Offset: offset,
    Limit: limit,
    TargetAppID: appID.value,
    Message: {
      Error: {
        Title: 'MSG_GET_APP_GOODS',
        Message: 'MSG_GET_APP_GOODS_FAIL',
        Popup: true,
        Type: NotifyType.Error
      }
    }
  }, (goods: Array<AppGood>, error: boolean) => {
    if (error || goods.length < limit) {
      return
    }
    getAppGoods(offset + limit, limit)
  })
}
</script>
