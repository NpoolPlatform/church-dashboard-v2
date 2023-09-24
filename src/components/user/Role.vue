<template>
  <q-table
    dense
    flat
    :title='$t("MSG_ROLES")'
    :rows='roles'
    row-key='ID'
    :loading='roleLoading'
    :rows-per-page-options='[100]'
    @row-click='(evt, row, index) => onRowClick(row as role.Role)'
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
import { AppID } from 'src/api/app'
import { computed, onMounted, ref, watch } from 'vue'
import { role, user, notify } from 'src/npoolstore'

const _role = role.useRoleStore()
const roles = computed(() => _role.roles(AppID.value))
const roleLoading = ref(false)

const logined = user.useLocalUserStore()

const getAppRoles = (offset: number, limit: number) => {
  _role.getAppRoles({
    TargetAppID: AppID.value,
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: 'MSG_GET_APP_AUTHS',
        Message: 'MSG_GET_APP_AUTHS_FAIL',
        Popup: true,
        Type: notify.NotifyType.Error
      }
    }
  }, (error: boolean, roles?: Array<role.Role>) => {
    if (error || !roles?.length) {
      roleLoading.value = false
      return
    }
    getAppRoles(offset + limit, limit)
  })
}

const prepare = () => {
  if (!roles.value.length) {
    roleLoading.value = true
    getAppRoles(0, 100)
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
const target = ref({
  AppID: AppID,
  CreatedBy: logined.User?.ID
} as unknown as role.Role)

const onCreate = () => {
  showing.value = true
  updating.value = false
}

const onSubmit = () => {
  showing.value = false

  if (updating.value) { // NEED UPDATE ROLE API
    _role.updateRole({
      Info: target.value,
      Message: {
        Error: {
          Title: 'MSG_UPDATE_ROLE',
          Message: 'MSG_UPDATE_ROLE_FAIL',
          Popup: true,
          Type: notify.NotifyType.Error
        }
      }
    }, () => {
      // TODO
    })
    return
  }

  _role.createAppRole({
    TargetAppID: AppID.value,
    RoleName: target.value.Role,
    Default: target.value.Default,
    Description: target.value.Description,
    Message: {
      Error: {
        Title: 'MSG_CREATE_ROLE',
        Message: 'MSG_CREATE_ROLE_FAIL',
        Popup: true,
        Type: notify.NotifyType.Error
      }
    }
  }, () => {
    // TODO
  })
}

const onRowClick = (role: role.Role) => {
  showing.value = true
  updating.value = true
  target.value = role
}

const onMenuHide = () => {
  showing.value = false
  target.value = {
    AppID: AppID,
    CreatedBy: logined.User?.ID
  } as unknown as role.Role
}

const onCancel = () => {
  onMenuHide()
}

</script>
