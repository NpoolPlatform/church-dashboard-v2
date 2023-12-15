<template>
  <q-table
    dense
    flat
    :rows='displayThirdParties'
    row-key='ID'
    :title='$t("MSG_OAUTH_THIRD_PARTIES")'
    :rows-per-page-options='[100]'
    @row-click='(evt, row, index) => onRowClick(row as oauthbase.OAuthThirdParty)'
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
        <q-select :options='appuserbase.SignMethodTypes' v-model='target.ClientName' :label='$t("MSG_CLIENT_NAME")' />
        <q-input v-model='target.ClientLogoURL' :label='$t("MSG_CLIENT_LOGO_URL")' />
        <q-input v-model='target.ClientOAuthURL' :label='$t("MSG_CLIENT_OAUTH_URL")' />
        <q-input v-model='target.ResponseType' :label='$t("MSG_RESPONSE_TYPE")' />
        <q-input v-model='target.ClientTag' :label='$t("MSG_CLIENT_TAG")' />
        <q-input v-model='target.Scope' :label='$t("MSG_SCOPE")' />
      </q-card-section>
      <q-item class='row'>
        <LoadingButton loading :label='$t("MSG_SUBMIT")' @click='onSubmit' />
        <q-btn class='btn round' :label='$t("MSG_CANCEL")' @click='onCancel' />
      </q-item>
    </q-card>
  </q-dialog>
</template>

<script setup lang='ts'>
import { computed, onMounted, ref, defineAsyncComponent } from 'vue'
import { oauththirdparty, notify, appuserbase, oauthbase } from 'src/npoolstore'

const LoadingButton = defineAsyncComponent(() => import('src/components/button/LoadingButton.vue'))

const thirdParty = oauththirdparty.useOAuthThirdPartyStore()
const thirdParties = computed(() => thirdParty.OAuthThirdParties)

const clientName = ref('')
const displayThirdParties = computed(() => {
  return thirdParties.value.filter((el) => {
    return el.ClientName?.toLowerCase()?.includes?.(clientName.value?.toLowerCase()) ||
           el.EntID?.toLowerCase()?.includes(clientName.value?.toLowerCase())
  })
})

const showing = ref(false)
const updating = ref(false)
const target = ref({} as oauthbase.OAuthThirdParty)

const onCreate = () => {
  showing.value = true
  updating.value = false
}

const onRowClick = (row: oauthbase.OAuthThirdParty) => {
  target.value = { ...row }
  showing.value = true
  updating.value = true
}

const onCancel = () => {
  onMenuHide()
}

const onMenuHide = () => {
  showing.value = false
  target.value = {} as oauthbase.OAuthThirdParty
}

const onSubmit = (done: () => void) => {
  updating.value ? updateOAuthThirdParty(done) : createOAuthThirdParty(done)
}

const createOAuthThirdParty = (done: () => void) => {
  thirdParty.createOAuthThirdParty({
    ...target.value,
    Message: {
      Error: {
        Title: 'MSG_CREATE_OAUTH_THIRD_PARTY',
        Message: 'MSG_CREATE_OAUTH_THIRD_PARTY_FAIL',
        Popup: true,
        Type: notify.NotifyType.Error
      },
      Info: {
        Title: 'MSG_CREATE_OAUTH_THIRD_PARTY',
        Message: 'MSG_CREATE_OAUTH_THIRD_PARTY_FAIL',
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

const updateOAuthThirdParty = (done: () => void) => {
  thirdParty.updateOAuthThirdParty({
    ...target.value,
    Message: {
      Error: {
        Title: 'MSG_UPDATE_OAUTH_THIRD_PARTY',
        Message: 'MSG_UPDATE_OAUTH_THIRD_PARTY_FAIL',
        Popup: true,
        Type: notify.NotifyType.Error
      },
      Info: {
        Title: 'MSG_UPDATE_OAUTH_THIRD_PARTY',
        Message: 'MSG_UPDATE_OAUTH_THIRD_PARTY_FAIL',
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

onMounted(() => {
  if (thirdParties.value.length === 0) {
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
  }
})
</script>
