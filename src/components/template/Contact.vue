<template>
  <q-table
    dense
    flat
    :title='$t("MSG_CONTACTS")'
    :rows='contacts'
    row-key='ID'
    :loading='contactsLoading'
    :rows-per-page-options='[100]'
    @row-click='(evt, row, index) => onRowClick(row as contact.Contact)'
  >
    <template #top-right>
      <div class='row indent flat'>
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
        <span>{{ $t('MSG_CREATE_CONTACT') }}</span>
      </q-card-section>
      <q-card-section>
        <q-select :options='basetypes.EventTypes' v-model='target.UsedFor' :disable='updating' :label='$t("MSG_USED_FOR")' />
        <q-select :options='appuserbase.SignMethodTypes' v-model='target.AccountType' :label='$t("MSG_CONTACT_TYPE")' />
        <q-input v-model='target.Account' :label='$t("MSG_ACCOUNT")' />
        <q-input v-model='target.Sender' :label='$t("MSG_SENDER")' />
      </q-card-section>
      <q-item class='row'>
        <!-- <q-btn class='btn round alt' :label='$t("MSG_SUBMIT")' @click='onSubmit' /> -->
        <LoadingButton :loading='true' :label='$t("MSG_SUBMIT")' @click='onSubmit' />
        <q-btn class='btn round' :label='$t("MSG_CANCEL")' @click='onCancel' />
      </q-item>
    </q-card>
  </q-dialog>
</template>

<script setup lang='ts'>
import { AppID } from 'src/api/app'
import { computed, defineAsyncComponent, onMounted, ref, watch } from 'vue'
import { contact, basetypes, appuserbase, notify } from 'src/npoolstore'

const LoadingButton = defineAsyncComponent(() => import('src/components/button/LoadingButton.vue'))

const _contact = contact.useContactStore()
const contacts = computed(() => _contact.contacts(AppID.value)?.sort((a, b) => a.UsedFor.localeCompare(b.UsedFor, 'zh-CN')))
const contactsLoading = ref(false)

const prepare = () => {
  if (!contacts.value.length) {
    getAppContacts(0, 100)
  }
}

watch(AppID, () => {
  prepare()
})

onMounted(() => {
  prepare()
})

const showing = ref(false)
const updating = ref(false)

const target = ref({} as unknown as contact.Contact)

const onMenuHide = () => {
  target.value = {} as unknown as contact.Contact
}

const onRowClick = (template: contact.Contact) => {
  target.value = { ...template }
  showing.value = true
  updating.value = true
}

const onCreate = () => {
  showing.value = true
  updating.value = false
}

const onSubmit = (done: () => void) => {
  updating.value ? updateAppContact(done) : createAppContact(done)
}

const onCancel = () => {
  showing.value = false
  onMenuHide()
}

const getAppContacts = (offset: number, limit: number) => {
  _contact.getAppContacts({
    TargetAppID: AppID.value,
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: 'MSG_GET_CONTACTS',
        Message: 'MSG_GET_CONTACTS_FAIL',
        Popup: true,
        Type: notify.NotifyType.Error
      }
    }
  }, (error: boolean, contacts?: Array<contact.Contact>) => {
    if (error || !contacts?.length) {
      contactsLoading.value = false
      return
    }
    getAppContacts(offset + limit, limit)
  })
}

const updateAppContact = (done: () => void) => {
  _contact.updateAppContact({
    TargetAppID: AppID.value,
    ...target.value,
    Message: {
      Error: {
        Title: 'MSG_UPDATE_CONTACT',
        Message: 'MSG_UPDATE_CONTACT_FAIL',
        Popup: true,
        Type: notify.NotifyType.Error
      }
    }
  }, (error: boolean) => {
    done()
    if (!error) {
      onCancel()
    }
  })
}

const createAppContact = (done: () => void) => {
  _contact.createAppContact({
    TargetAppID: AppID.value,
    ...target.value,
    Message: {
      Error: {
        Title: 'MSG_CREATE_CONTACT',
        Message: 'MSG_CREATE_CONTACT_FAIL',
        Popup: true,
        Type: notify.NotifyType.Error
      }
    }
  }, (error: boolean) => {
    done()
    if (!error) {
      onCancel()
    }
  })
}
</script>
