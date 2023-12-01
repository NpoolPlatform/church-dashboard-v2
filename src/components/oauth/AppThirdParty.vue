<template>
  <q-table
    dense
    flat
    :rows='displayThirdParties'
    row-key='ID'
    :title='$t("MSG_APP_OAUTH_THIRD_PARTIES")'
    :rows-per-page-options='[100]'
    @row-click='(evt, row, index) => onRowClick(row as appoauththirdparty.AppOAuthThirdParty)'
    v-model:selected='selectedThirdParty'
    selection='single'
  >
    <template #top-right>
      <div class='row indent flat'>
        <q-input
          dense
          flat
          class='small'
          v-model='clientName'
          :label='$t("MSG_CLIENT_NAME")'
        />
        <q-btn
          dense
          flat
          class='btn flat'
          :label='$t("MSG_CREATE")'
          @click='onCreate'
        />
        <q-btn
          dense
          flat
          class='btn flat'
          :label='$t("MSG_DELETE")'
          @click='onDelete'
        />
      </div>
    </template>
  </q-table>
  <q-dialog
    v-model='showing'
    @hide='onMenuHide'
    position='right'
  >
    <q-card class='popup-menu'>
      <q-card-section>
        <q-select
          :options='thirdParties'
          v-model='target.ThirdPartyID'
          :label='$t("MSG_CLIENT_NAME")'
          emit-value
          map-options
        />
        <q-input v-model='target.ClientID' :label='$t("MSG_CLIENT_ID")' />
        <q-input v-model='target.ClientSecret' :label='$t("MSG_CLIENT_SECRET")' />
        <q-input v-model='target.CallbackURL' :label='$t("MSG_CALLBACK_URL")' />
      </q-card-section>
      <q-item class='row'>
        <LoadingButton loading :label='$t("MSG_SUBMIT")' @click='onSubmit' />
        <q-btn class='btn round' :label='$t("MSG_CANCEL")' @click='onCancel' />
      </q-item>
    </q-card>
  </q-dialog>
</template>

<script setup lang='ts'>
import { computed, onMounted, ref, defineAsyncComponent, watch } from 'vue'
import { AppID } from 'src/api/app'
import { appoauththirdparty, oauththirdparty, notify } from 'src/npoolstore'

const LoadingButton = defineAsyncComponent(() => import('src/components/button/LoadingButton.vue'))

const appThirdParty = appoauththirdparty.useAppOAuthThirdPartyStore()
const appThirdParties = computed(() => appThirdParty.AppOAuthThirdParties.get(AppID.value) as Array<appoauththirdparty.AppOAuthThirdParty>)
const thirdParty = oauththirdparty.useOAuthThirdPartyStore()
const thirdParties = computed(() => thirdParty.OAuthThirdParties.map((el) => {
  return {
    label: el.ClientName,
    value: el.ID
  }
}))

const clientName = ref('')
const displayThirdParties = computed(() => {
  if (!appThirdParties.value) {
    return []
  }
  return appThirdParties.value.filter((el) => {
    return el.ClientName?.toLowerCase()?.includes?.(clientName.value?.toLowerCase()) ||
           el.EntID?.toLowerCase()?.includes(clientName.value?.toLowerCase())
  })
})

const showing = ref(false)
const updating = ref(false)
const target = ref({} as appoauththirdparty.AppOAuthThirdParty)

const selectedThirdParty = ref([] as Array<appoauththirdparty.AppOAuthThirdParty>)
const onDelete = () => {
  selectedThirdParty.value.forEach((el) => {
    appThirdParty.deleteAppOAuthThirdParty({
      ID: el.ID,
      EntID: el.EntID,
      TargetAppID: el.AppID,
      Message: {
        Error: {
          Title: 'MSG_DELETE_APP_OAUTH_THIRD_PARTY',
          Message: 'MSG_DELETE_APP_OAUTH_THIRD_PARTY_FAIL',
          Popup: true,
          Type: notify.NotifyType.Error
        },
        Info: {
          Title: 'MSG_DELETE_APP_OAUTH_THIRD_PARTY',
          Message: 'MSG_DELETE_APP_OAUTH_THIRD_PARTY_FAIL',
          Popup: true,
          Type: notify.NotifyType.Success
        }
      }
    }, () => {
      // TODO
    })
  })
}

const onCreate = () => {
  showing.value = true
  updating.value = false
}

const onRowClick = (row: appoauththirdparty.AppOAuthThirdParty) => {
  target.value = { ...row }
  showing.value = true
  updating.value = true
}

const onCancel = () => {
  onMenuHide()
}

const onMenuHide = () => {
  showing.value = false
  target.value = {} as appoauththirdparty.AppOAuthThirdParty
}

const onSubmit = (done: () => void) => {
  updating.value ? updateCoin(done) : createCoin(done)
}

const createCoin = (done: () => void) => {
  appThirdParty.createAppOAuthThirdParty({
    TargetAppID: AppID.value,
    ...target.value,
    Message: {
      Error: {
        Title: 'MSG_CREATE_APP_OAUTH_THIRD_PARTY',
        Message: 'MSG_CREATE_APP_OAUTH_THIRD_PARTY_FAIL',
        Popup: true,
        Type: notify.NotifyType.Error
      },
      Info: {
        Title: 'MSG_CREATE_APP_OAUTH_THIRD_PARTY',
        Message: 'MSG_CREATE_APP_OAUTH_THIRD_PARTY_FAIL',
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

const updateCoin = (done: () => void) => {
  appThirdParty.updateAppOAuthThirdParty({
    TargetAppID: AppID.value,
    ...target.value,
    Message: {
      Error: {
        Title: 'MSG_UPDATE_APP_OAUTH_THIRD_PARTY',
        Message: 'MSG_UPDATE_APP_OAUTH_THIRD_PARTY_FAIL',
        Popup: true,
        Type: notify.NotifyType.Error
      },
      Info: {
        Title: 'MSG_UPDATE_APP_OAUTH_THIRD_PARTY',
        Message: 'MSG_UPDATE_APP_OAUTH_THIRD_PARTY_FAIL',
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

watch(AppID, () => {
  appThirdParty.getAppOAuthThirdParties({
    TargetAppID: AppID.value,
    Offset: 0,
    Limit: 20,
    Message: {
      Error: {
        Title: 'MSG_GET_OAUTH_THIRD_PARTIES',
        Message: 'MSG_GET_OAUTH_THIRD_PARTIES_FAIL',
        Popup: true,
        Type: notify.NotifyType.Error
      }
    }
  }, () => {
    // TODO
  })
})

onMounted(() => {
  appThirdParty.getAppOAuthThirdParties({
    TargetAppID: AppID.value,
    Offset: 0,
    Limit: 20,
    Message: {
      Error: {
        Title: 'MSG_GET_OAUTH_THIRD_PARTIES',
        Message: 'MSG_GET_OAUTH_THIRD_PARTIES_FAIL',
        Popup: true,
        Type: notify.NotifyType.Error
      }
    }
  }, () => {
    // TODO
  })
  thirdParty.getOAuthThirdParties({
    Offset: 0,
    Limit: 20,
    Message: {
      Error: {
        Title: 'MSG_GET_OAUTH_THIRD_PARTIES',
        Message: 'MSG_GET_OAUTH_THIRD_PARTIES_FAIL',
        Popup: true,
        Type: notify.NotifyType.Error
      }
    }
  }, () => {
    // TODO
  })
})
</script>
