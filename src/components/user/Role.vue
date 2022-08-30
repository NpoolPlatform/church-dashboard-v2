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
import { AppRole, NotificationType, useLoginedUserStore, useChurchRolesStore } from 'npool-cli-v2'
import { NotifyType, Role, useChurchRoleStore } from 'npool-cli-v4'
import { useLocalApplicationStore } from 'src/localstore'
import { computed, onMounted, ref, watch } from 'vue'

const app = useLocalApplicationStore()
const appID = computed(() => app.AppID)

const role = useChurchRolesStore()
const roles = computed(() => churchRole.Roles.get(appID.value) ? churchRole.Roles.get(appID.value) : [])
const roleLoading = ref(false)

const logined = useLoginedUserStore()

const churchRole = useChurchRoleStore()

const getRoles = (offset: number, limit: number) => {
  churchRole.getAppRoles({
    TargetAppID: appID.value,
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: 'MSG_GET_APP_AUTHS',
        Message: 'MSG_GET_APP_AUTHS_FAIL',
        Popup: true,
        Type: NotifyType.Error
      }
    }
  }, (roles: Array<Role>, error: boolean) => {
    if (error) {
      return
    }
    if (roles.length >= limit) {
      getRoles(offset + limit, limit)
    }
    roleLoading.value = false
  })
}

const prepare = () => {
  roleLoading.value = true
  getRoles(0, 100)
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

  if (updating.value) {
    role.updateRole({
      Info: target.value,
      Message: {
        Error: {
          Title: 'MSG_UPDATE_ROLE',
          Message: 'MSG_UPDATE_ROLE_FAIL',
          Popup: true,
          Type: NotificationType.Error
        }
      }
    }, () => {
      // TODO
    })
    return
  }

  churchRole.createAppRole({
    TargetAppID: appID.value,
    RoleName: target.value.Role,
    Default: target.value.Default,
    Description: target.value.Description,
    Message: {
      Error: {
        Title: 'MSG_CREATE_ROLE',
        Message: 'MSG_CREATE_ROLE_FAIL',
        Popup: true,
        Type: NotifyType.Error
      }
    }
  }, () => {
    // TODO
  })
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
