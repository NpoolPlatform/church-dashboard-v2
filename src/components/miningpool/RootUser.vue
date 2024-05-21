<template>
  <q-table
    dense
    flat
    :title='$t("MSG_MININGPOOL_ROOTUSERS")'
    :rows='rootusers'
    :columns='columns'
    row-key='ID'
    :rows-per-page-options='[100]'
    @row-click='(evt, row, index) => onRowClick(row as miningpoolrootuser.RootUser)'
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
        <span>{{ $t('MSG_MININGPOOL_ROOTUSER') }}</span>
      </q-card-section>
      <q-card-section>
        <PoolPicker v-if='!updating' v-model:id='target.PoolID' :label='$t("MSG_POOLID")' />
        <q-input v-model='target.Name' :label='$t("MSG_NAME")' />
        <q-input v-model='target.Email' :label='$t("MSG_EMAIL")' />
        <q-input v-model='target.AuthToken' :label='$t("MSG_AUTHTOKEN")' />
        <q-input v-model='target.Remark' :label='$t("MSG_REMARK")' />
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
import { useI18n } from 'vue-i18n'
import { miningpoolrootuser, notify } from 'src/npoolstore'

const PoolPicker = defineAsyncComponent(() => import('src/components/miningpool/PoolPicker.vue'))

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const LoadingButton = defineAsyncComponent(() => import('src/components/button/LoadingButton.vue'))

const rootuserInfo = miningpoolrootuser.useMiningpoolRootUserStore()
const rootusers = computed(() => rootuserInfo.rootusers())

const target = ref({} as miningpoolrootuser.RootUser)
const showing = ref(false)
const updating = ref(false)

const onCreate = () => {
  updating.value = false
  showing.value = true
}

const onRowClick = (row: miningpoolrootuser.RootUser) => {
  updating.value = true
  showing.value = true
  target.value = { ...row }
}

const onSubmit = (done: () => void) => {
  showing.value = false
  updating.value ? updateRootUser(done) : createRootUser(done)
}

const onCancel = () => {
  showing.value = false
}

const onMenuHide = () => {
  target.value = {} as miningpoolrootuser.RootUser
  showing.value = false
}

const updateRootUser = (done: () => void) => {
  rootuserInfo.updateRootUser({
    ...target.value,
    Message: {
      Error: {
        Title: t('MSG_UPDATE_MININGPOOL'),
        Message: t('MSG_UPDATE_MININGPOOL_FAIL'),
        Popup: true,
        Type: notify.NotifyType.Error
      },
      Info: {
        Title: t('MSG_UPDATE_MININGPOOL'),
        Message: t('MSG_UPDATE_MININGPOOL_SUCCESS'),
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

const createRootUser = (done: () => void) => {
  rootuserInfo.createRootUser({
    ...target.value,
    Message: {
      Error: {
        Title: t('MSG_CREATE_MININGPOOL'),
        Message: t('MSG_CREATE_MININGPOOL_FAIL'),
        Popup: true,
        Type: notify.NotifyType.Error
      },
      Info: {
        Title: t('MSG_CREATE_MININGPOOL'),
        Message: t('MSG_CREATE_MININGPOOL_SUCCESS'),
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

const getRootUsers = (offset: number, limit: number) => {
  rootuserInfo.getRootUsers({
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: t('MSG_ADMIN_GET_POOLS'),
        Message: t('MSG_ADMIN_GET_POOL_FAIL'),
        Popup: true,
        Type: notify.NotifyType.Error
      }
    }
  }, (error: boolean, rootusers?: Array<miningpoolrootuser.RootUser>) => {
    if (error || !rootusers?.length) {
      return
    }
    getRootUsers(offset + limit, limit)
  })
}

onMounted(() => {
  if (!rootusers.value.length) {
    getRootUsers(0, 100)
  }
})

const columns = computed(() => [
  {
    name: 'ID',
    label: t('MSG_ID'),
    sortable: true,
    field: (row: miningpoolrootuser.RootUser) => row.ID
  },
  {
    name: 'ENTID',
    label: t('MSG_ENTID'),
    sortable: true,
    field: (row: miningpoolrootuser.RootUser) => row.EntID
  },
  {
    name: 'POOLID',
    label: t('MSG_POOLID'),
    sortable: true,
    field: (row: miningpoolrootuser.RootUser) => row.PoolID
  },
  {
    name: 'NAME',
    label: t('MSG_NAME'),
    sortable: true,
    field: (row: miningpoolrootuser.RootUser) => row.Name
  },
  {
    name: 'EMAIL',
    label: t('MSG_EMAIL'),
    sortable: true,
    field: (row: miningpoolrootuser.RootUser) => row.Email
  },
  {
    name: 'AUTHTOKEN',
    label: t('MSG_AUTHTOKEN'),
    sortable: true,
    field: (row: miningpoolrootuser.RootUser) => row.AuthToken
  },
  {
    name: 'AUTHED',
    label: t('MSG_AUTHED'),
    sortable: true,
    field: (row: miningpoolrootuser.RootUser) => row.Authed
  },
  {
    name: 'REMARK',
    label: t('MSG_REMARK'),
    sortable: true,
    field: (row: miningpoolrootuser.RootUser) => row.Remark
  },
  {
    name: 'MININGPOOLTYPE',
    label: t('MSG_MININGPOOLTYPE'),
    sortable: true,
    field: (row: miningpoolrootuser.RootUser) => row.MiningpoolType
  },
  {
    name: 'CREATEDAT',
    label: t('MSG_CREATEDAT'),
    sortable: true,
    field: (row: miningpoolrootuser.RootUser) => row.CreatedAt
  },
  {
    name: 'UPDATEDAT',
    label: t('MSG_UPDATEDAT'),
    sortable: true,
    field: (row: miningpoolrootuser.RootUser) => row.UpdatedAt
  }
])
</script>
