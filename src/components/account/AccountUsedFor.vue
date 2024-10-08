<template>
  <q-dialog
    v-model='showing'
    @hide='onMenuHide'
    position='right'
  >
    <q-card class='popup-menu'>
      <q-card-section v-if='!updating'>
        <CoinPicker v-model:coin-type-id='target.CoinTypeID' />
        <q-input v-if='hiddenAddress ' v-model='target.Address' :label='$t("MSG_ADDRESS")' />
        <q-select :options='accountbase.AccountUsedFors' v-model='target.UsedFor' disable :label='$t("MSG_ACCOUNT_USED_FOR")' />
      </q-card-section>
      <q-card-section v-if='updating'>
        <div>
          <span>{{ $t("MSG_ID") }}: {{ target?.ID }}</span>
        </div>
        <div>
          <span>{{ $t("MSG_ACCOUNT_ID") }}: {{ target?.AccountID }}</span>
        </div>
        <div>
          <span>{{ $t("MSG_ADDRESS") }}: {{ target?.Address }}</span>
        </div>
        <div>
          <span>{{ $t("MSG_COIN_NAME") }}: {{ target?.CoinName }}</span>
        </div>
        <div>
          <span>{{ $t("MSG_ACCOUNT_USED_FOR") }}: {{ target?.UsedFor }}</span>
        </div>
        <div>
          <q-toggle dense v-model='target.Backup' :label='$t("MSG_BACKUP")' />
        </div>
        <div>
          <q-toggle dense v-model='target.Blocked' :label='$t("MSG_BLOCKED")' />
        </div>
        <div>
          <q-toggle dense v-model='target.Active' :label='$t("MSG_ACTIVE")' />
        </div>
        <div>
          <q-toggle dense v-model='target.Locked' :label='$t("MSG_LOCKED")' />
        </div>
      </q-card-section>
      <q-item class='row'>
        <LoadingButton loading :label='$t("MSG_SUBMIT")' @click='onSubmit' />
        <q-btn class='btn round' :label='$t("MSG_CANCEL")' @click='onCancel' />
      </q-item>
    </q-card>
  </q-dialog>
</template>

<script setup lang='ts'>
import { computed, defineAsyncComponent, ref, defineProps, toRef, defineEmits } from 'vue'
import { accountbase, platformaccount, notify } from 'src/npoolstore'

const CoinPicker = defineAsyncComponent(() => import('src/components/coin/CoinPicker.vue'))
const LoadingButton = defineAsyncComponent(() => import('src/components/button/LoadingButton.vue'))

interface Props {
  visible: boolean
  update: boolean
  account: platformaccount.Account
}

const props = defineProps<Props>()
const visible = toRef(props, 'visible')
const update = toRef(props, 'update')
const account = toRef(props, 'account')

const emit = defineEmits<{(e: 'update:visible', visible: boolean): void}>()

const target = computed(() => account.value)

const showing = ref(visible)
const updating = ref(update)

const onMenuHide = () => {
  showing.value = false
  emit('update:visible', false)
}

const hiddenAddress = computed(() => {
  const whitelist = [accountbase.AccountUsedFor.GasProvider, accountbase.AccountUsedFor.UserBenefitHot]
  const found = whitelist.find((el) => el === target.value.UsedFor)
  return !found
})

const onCancel = () => {
  onMenuHide()
}

const onSubmit = (done: () => void) => {
  updating.value ? updatePlatformAccount(done) : createPlatformAccount(done)
}

const platform = platformaccount.usePlatformAccountStore()

const updateTarget = computed(() => {
  return {
    ID: target.value.ID,
    EntID: target.value.EntID,
    Backup: target.value.Backup,
    Active: target.value.Active,
    Blocked: target.value.Blocked,
    Locked: target.value.Locked
  }
})
// Only For GasFeeder & Platform & UserCold & UserHot & Collector Account
const updatePlatformAccount = (done: () => void) => {
  platform.updatePlatformAccount({
    ...updateTarget.value,
    Message: {
      Error: {
        Title: 'MSG_UPDATE_PLATFORM_ACCOUNT',
        Popup: true,
        Type: notify.NotifyType.Error
      },
      Info: {
        Title: 'MSG_UPDATE_PLATFORM_ACCOUNT',
        Popup: true,
        Type: notify.NotifyType.Success
      }
    }
  }, (error: boolean) => {
    done()
    if (error) {
      return
    }
    onMenuHide()
  })
}

const createPlatformAccount = (done: () => void) => {
  platform.createPlatformAccount({
    ...target.value,
    Message: {
      Error: {
        Title: 'MSG_CREATE_PLATFORM_ACCOUNT',
        Popup: true,
        Type: notify.NotifyType.Error
      },
      Info: {
        Title: 'MSG_CREATE_PLATFORM_ACCOUNT',
        Popup: true,
        Type: notify.NotifyType.Success
      }
    }
  }, (error: boolean) => {
    done()
    if (error) {
      return
    }
    onMenuHide()
  })
}

</script>
