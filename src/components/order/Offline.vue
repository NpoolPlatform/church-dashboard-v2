<template>
  <div class='row'>
    <q-space />
    <q-btn
      dense
      flat
      class='btn flat'
      :label='$t("MSG_CREATE")'
      @click='onCreate'
    />
  </div>
  <OrderPage />
  <q-dialog
    v-model='showing'
    @hide='onMenuHide'
    position='right'
  >
    <q-card class='popup-menu'>
      <q-card-section>
        <span>{{ $t('MSG_CREATE_OFFLINE_ORDER') }}</span>
      </q-card-section>
      <q-card-section>
        <q-item-label>{{ $t('MSG_TOTAL') }}: {{ selectedGood?.value?.Total }}</q-item-label>
        <q-item-label>{{ $t('MSG_LOCKED') }}: {{ selectedGood?.value?.Locked }}</q-item-label>
        <q-item-label>{{ $t('MSG_IN_SERVICE') }}: {{ selectedGood?.value?.InService }}</q-item-label>
        <q-select :options='goods' v-model='selectedGood' :label='$t("MSG_GOOD")' />
        <q-select
          :options='displayUsers'
          use-input
          v-model='selectedUser'
          :label='$t("MSG_USER")'
          @filter='filterUser'
        />
        <q-input
          v-model='units' :label='$t("MSG_PURCHASE_UNITS")' type='number' min='0'
          :max='maxUnits'
          :suffix='selectedGood?.value?.Unit'
        />
      </q-card-section>
      <q-item class='row'>
        <q-btn class='btn round alt' :label='$t("MSG_SUBMIT")' @click='onSubmit' />
        <q-btn class='btn round' :label='$t("MSG_CANCEL")' @click='onCancel' />
      </q-item>
    </q-card>
  </q-dialog>
  <q-card>
    <q-card-section class='bg-primary text-white'>
      {{ $t('MSG_ADVERTISEMENT_POSITION') }}
    </q-card-section>
  </q-card>
</template>

<script setup lang='ts'>
import { AppGood, NotifyType, useChurchAppGoodStore, useChurchOrderStore, useChurchUserStore, User, Order, OrderType } from 'npool-cli-v4'
import { getAppUsers } from 'src/api/user'
import { useLocalApplicationStore } from 'src/localstore'
import { defineAsyncComponent, computed, ref, watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const OrderPage = defineAsyncComponent(() => import('src/components/billing/Order.vue'))

const app = useLocalApplicationStore()
const appID = computed(() => app.AppID)

const good = useChurchAppGoodStore()
const appGoods = computed(() => good.getGoodsByAppID(appID.value))

interface MyGood {
  label: string
  value: AppGood
}
const goods = computed(() => Array.from(appGoods.value.filter((el) => el.Online)).map((el) => {
  return {
    label: el.GoodName,
    value: el
  } as MyGood
}))

interface MyUser {
  label: string
  value: User
}

const user = useChurchUserStore()
const users = computed(() => Array.from(user.Users.get(appID.value) ? user.Users.get(appID.value) as Array<User> : []).map((el) => {
  return {
    label: el.EmailAddress?.length ? el.EmailAddress : el.PhoneNO,
    value: el
  } as MyUser
}))

const displayUsers = ref(users.value)
const filterUser = (val: string, doneFn: (callbackFn: () => void) => void) => {
  doneFn(() => {
    displayUsers.value = users.value.filter((el) => {
      return el.value.EmailAddress?.toLowerCase().includes(val.toLowerCase()) || el.value.PhoneNO?.toLowerCase().includes(val.toLowerCase())
    })
  })
}

const selectedGood = ref(undefined as unknown as MyGood)
const selectedUser = ref(undefined as unknown as MyUser)

const units = ref(1)
const maxUnits = computed(() => selectedGood.value?.value?.Total - (selectedGood.value?.value?.Locked) - (selectedGood.value?.value?.InService))

const showing = ref(false)

const onCreate = () => {
  showing.value = true
}

const onCancel = () => {
  onMenuHide()
}

const onMenuHide = () => {
  showing.value = false
  selectedGood.value = undefined as unknown as MyGood
  selectedUser.value = undefined as unknown as MyUser
}

const order = useChurchOrderStore()

const onSubmit = () => {
  if (units.value > maxUnits.value) {
    console.log('purchase units', units.value, 'max units', maxUnits.value)
    return
  }
  if (!selectedGood.value) {
    console.log('please select good')
    return
  }
  if (!selectedUser.value) {
    console.log('please select user')
    return
  }

  order.createAppUserOrder({
    TargetAppID: appID.value,
    TargetUserID: selectedUser.value.value.ID,
    GoodID: selectedGood.value.value.GoodID,
    Units: units.value,
    PaymentCoinID: selectedGood.value.value.CoinTypeID,
    OrderType: OrderType.Offline,
    Message: {
      Error: {
        Title: t('MSG_CREATE_ORDER'),
        Message: t('MSG_CREATE_ORDER_FAIL'),
        Popup: true,
        Type: NotifyType.Error
      }
    }
  }, (o : Order, error: boolean) => {
    if (error) {
      return
    }
    onMenuHide()
  })
}

const prepare = () => {
  if (users.value.length === 0) {
    getAppUsers(0, 500)
  }
}

watch(appID, () => {
  prepare()
})

onMounted(() => {
  prepare()
})
</script>
