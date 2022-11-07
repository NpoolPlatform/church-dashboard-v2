<template>
  <q-dialog
    v-model='showing'
    @hide='onMenuHide'
    position='right'
  >
    <q-card class='popup-menu'>
      <q-card-section>
        <span>{{ $t('MSG_CREATE_APPLICATION') }}</span>
      </q-card-section>
      <q-card-section v-if='!updating'>
        <CoinPicker v-model:coin='target.CoinTypeID' />
        <q-input v-model='target.Address' :label='$t("MSG_ADDRESS")' />
        <q-select :options='AccountUsedFors' v-model='target.UsedFor' disable :label='$t("MSG_ACCOUNT_USED_FOR")' />
      </q-card-section>
      <q-card-section v-if='updating'>
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
import { AccountUsedFor, AccountUsedFors, NotifyType, PlatformAccount, useChurchPlatformAccountStore } from 'npool-cli-v4'
import { computed, defineAsyncComponent, ref, defineProps, toRef, defineEmits, onMounted } from 'vue'

const CoinPicker = defineAsyncComponent(() => import('src/components/coin/CoinPicker.vue'))
const LoadingButton = defineAsyncComponent(() => import('src/components/button/LoadingButton.vue'))

interface Props {
  visible: boolean
  update: boolean
  usedFor: AccountUsedFor
  account: PlatformAccount
}

const props = defineProps<Props>()
const visible = toRef(props, 'visible')
const update = toRef(props, 'update')
const usedFor = toRef(props, 'usedFor')
const account = toRef(props, 'account')

const emit = defineEmits<{(e: 'update:visible', visible: boolean): void}>()

const platform = useChurchPlatformAccountStore()

const target = ref({ UsedFor: usedFor.value } as PlatformAccount)
const showing = ref(visible)
const updating = ref(update)

const onMenuHide = () => {
  showing.value = false
  target.value = {} as PlatformAccount
  emit('update:visible', false)
}

const onCancel = () => {
  onMenuHide()
}

const onSubmit = (done: () => void) => {
  updating.value ? updatePlatformAccount(done) : createPlatformAccount(done)
}

const updateTarget = computed(() => {
  return {
    ID: target.value.ID,
    Backup: target.value.Backup,
    Active: target.value.Active,
    Blocked: target.value.Blocked,
    Locked: target.value.Locked
  }
})

const updatePlatformAccount = (done: () => void) => {
  platform.updatePlatformAccount({
    ...updateTarget.value,
    Message: {
      Error: {
        Title: 'MSG_UPDATE_PLATFORM_ACCOUNT',
        Popup: true,
        Type: NotifyType.Error
      },
      Info: {
        Title: 'MSG_UPDATE_PLATFORM_ACCOUNT',
        Popup: true,
        Type: NotifyType.Success
      }
    }
  }, (account: PlatformAccount, error: boolean) => {
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
        Type: NotifyType.Error
      },
      Info: {
        Title: 'MSG_CREATE_PLATFORM_ACCOUNT',
        Popup: true,
        Type: NotifyType.Success
      }
    }
  }, (account: PlatformAccount, error: boolean) => {
    done()
    if (error) {
      return
    }
    onMenuHide()
  })
}

onMounted(() => {
  if (account.value?.ID) {
    target.value = { ...account.value }
  }
})
</script>
