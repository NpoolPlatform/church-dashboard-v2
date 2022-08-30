<template>
  <q-table
    dense
    flat
    :title='$t("MSG_ROLES")'
    :rows='roles'
    row-key='ID'
    :loading='roleLoading'
    :rows-per-page-options='[20]'
    @row-click='(evt, row, index) => onRowClick(row as AppRole)'
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
  <q-card>
    <q-card-section class='bg-primary text-white'>
      {{ $t('MSG_ADVERTISEMENT_POSITION') }}
    </q-card-section>
  </q-card>
  <q-dialog
    v-model='showing'
    @hide='onMenuHide'
    position='right'
  >
    <q-card class='popup-menu'>
      <q-card-section>
        <span>{{ $t('MSG_CREATE_ROLE') }}</span>
      </q-card-section>
      <q-card-section>
        <q-input v-model='target.Role' :label='$t("MSG_ROLE")' />
        <q-input v-model='target.Description' :label='$t("MSG_DESCRIPTION")' />
        <q-toggle v-model='target.Default' :label='$t("MSG_DEFAULT_ROLE")' />
      </q-card-section>
      <q-item class='row'>
        <q-btn class='btn round alt' :label='$t("MSG_SUBMIT")' @click='onSubmit' />
        <q-btn class='btn round' :label='$t("MSG_CANCEL")' @click='onCancel' />
      </q-item>
    </q-card>
  </q-dialog>
</template>

<script setup lang='ts'>
import { AppRole, useLoginedUserStore } from 'npool-cli-v2'
import { useChurchRoleStore, NotifyType } from 'npool-cli-v4'
import { useLocalApplicationStore } from 'src/localstore'
import { computed, onMounted, ref, watch } from 'vue'

const app = useLocalApplicationStore()
const appID = computed(() => app.AppID)

const role = useChurchRoleStore()
const roles = computed(() => role.Roles.get(appID.value) ? role.Roles.get(appID.value) : [])
const roleLoading = ref(true)

const logined = useLoginedUserStore()

const prepare = () => {
  roleLoading.value = true
  role.getAppRoles({
    TargetAppID: appID.value,
    Offset: 0,
    Limit: 100,
    Message: {
      Error: {
        Title: 'MSG_GET_ROLES',
        Message: 'MSG_GET_ROLES_FAIL',
        Popup: true,
        Type: NotifyType.Error
      }
    }
  }, () => {
    roleLoading.value = false
  })
}

watch(appID, () => {
  prepare()
})

onMounted(() => {
  prepare()
})

const showing = ref(false)
const updating = ref(false)
const target = ref({
  AppID: appID,
  CreatedBy: logined.LoginedUser?.User.ID as string
} as unknown as AppRole)

const onCreate = () => {
  showing.value = true
  updating.value = false
}

const onSubmit = () => {
  showing.value = false
  // TODO
}

const onRowClick = (role: AppRole) => {
  showing.value = true
  updating.value = true
  target.value = role
}

const onMenuHide = () => {
  showing.value = false
  target.value = {
    AppID: appID,
    CreatedBy: logined.LoginedUser?.User.ID as string
  } as unknown as AppRole
}

const onCancel = () => {
  onMenuHide()
}

</script>
