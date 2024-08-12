<template>
  <q-dialog
    v-model='showing'
    @hide='onMenuHide'
    position='right'
  >
    <q-card class='popup-menu'>
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
          <span>{{ $t("MSG_EMAILADDRESS") }}: {{ target?.EmailAddress }}</span>
        </div>
        <div>
          <span>{{ $t("MSG_PHONENO") }}: {{ target?.PhoneNO }}</span>
        </div>
        <div>
          <q-toggle dense v-model='target.Blocked' :label='$t("MSG_BLOCKED")' />
        </div>
        <div>
          <q-toggle dense v-model='target.Active' :label='$t("MSG_ACTIVE")' />
        </div>
      </q-card-section>
      <q-item class='row'>
        <q-btn class='btn round' :loading='submitting' :label='$t("MSG_SUBMIT")' @click='onSubmit' />
        <q-btn class='btn alt round' :label='$t("MSG_CANCEL")' @click='onCancel' />
      </q-item>
    </q-card>
  </q-dialog>
</template>

<script setup lang='ts'>
import { computed, ref, defineProps, toRef, defineEmits } from 'vue'
import { useraccount, useraccountbase, notify } from 'src/npoolstore'

interface Props {
  visible: boolean
  update: boolean
  account: useraccountbase.Account
}

const props = defineProps<Props>()
const visible = toRef(props, 'visible')
const update = toRef(props, 'update')
const account = toRef(props, 'account')

const emit = defineEmits<{(e: 'update:visible', visible: boolean): void}>()

const target = computed(() => account.value)

const showing = ref(visible)
const updating = ref(update)
const submitting = ref(false)

const onMenuHide = () => {
  showing.value = false
  submitting.value = false
  emit('update:visible', false)
}

const onCancel = () => {
  onMenuHide()
}

const onSubmit = () => {
  updateUserAccount()
}

const _useraccount = useraccount.useUserAccountStore()

const updateTarget = computed(() => {
  return {
    ID: target.value.ID,
    EntID: target.value.EntID,
    TargetAppID: target.value.AppID,
    TargetUserID: target.value.UserID,
    Active: target.value.Active,
    Blocked: target.value.Blocked
  }
})
// Withdraw & DirectBenefit
const updateUserAccount = () => {
  _useraccount.updateAppUserAccount({
    ...updateTarget.value,
    Message: {
      Error: {
        Title: 'MSG_UPDATE_ACCOUNT',
        Popup: true,
        Type: notify.NotifyType.Error
      },
      Info: {
        Title: 'MSG_UPDATE_ACCOUNT',
        Popup: true,
        Type: notify.NotifyType.Success
      }
    }
  }, (error: boolean) => {
    if (error) {
      return
    }
    onMenuHide()
  })
}
</script>
