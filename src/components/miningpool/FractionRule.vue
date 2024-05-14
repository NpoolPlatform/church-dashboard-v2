<template>
  <q-table
    dense
    flat
    :title='$t("MSG_MININGPOOLS")'
    :rows='devices'
    :columns='poolColums'
    row-key='ID'
    :rows-per-page-options='[100]'
    @row-click='(evt, row, index) => onRowClick(row as miningpoolpool.Pool)'
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
        <span>{{ $t('MSG_MININGPOOL') }}</span>
      </q-card-section>
      <q-card-section>
        <q-select v-if='!updating' :options='miningpoolbase.MiningpoolTypes' v-model='target.MiningpoolType' :label='$t("MSG_MININGPOOL_TYPE")' />
        <q-input v-model='target.Name' :label='$t("MSG_NAME")' />
        <q-input v-model='target.Site' :label='$t("MSG_SITE")' />
        <q-input v-model='target.Logo' :label='$t("MSG_LOGO")' />
        <q-input v-model='target.Description' :label='$t("MSG_DESCRIPTION")' />
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
import { miningpoolpool, miningpoolbase, notify } from 'src/npoolstore'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const LoadingButton = defineAsyncComponent(() => import('src/components/button/LoadingButton.vue'))

const poolInfo = miningpoolpool.useMiningpoolPoolStore()
const devices = computed(() => poolInfo.pools())

const target = ref({} as miningpoolpool.Pool)
const showing = ref(false)
const updating = ref(false)

const onCreate = () => {
  updating.value = false
  showing.value = true
}

const onRowClick = (row: miningpoolpool.Pool) => {
  updating.value = true
  showing.value = true
  target.value = { ...row }
}

const onSubmit = (done: () => void) => {
  showing.value = false
  updating.value ? updatePool(done) : createPool(done)
}

const onCancel = () => {
  showing.value = false
}

const onMenuHide = () => {
  target.value = {} as miningpoolpool.Pool
  showing.value = false
}

const updatePool = (done: () => void) => {
  poolInfo.updatePool({
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

const createPool = (done: () => void) => {
  poolInfo.createPool({
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

const getPools = (offset: number, limit: number) => {
  poolInfo.getPools({
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
  }, (error: boolean, pools?: Array<miningpoolpool.Pool>) => {
    if (error || !pools?.length) {
      return
    }
    getPools(offset + limit, limit)
  })
}

onMounted(() => {
  if (!devices.value.length) {
    getPools(0, 100)
  }
})

const poolColums = computed(() => [
  {
    name: 'ID',
    label: t('MSG_ID'),
    sortable: true,
    field: (row: miningpoolpool.Pool) => row.ID
  },
  {
    name: 'ENTID',
    label: t('MSG_ENT_ID'),
    sortable: true,
    field: (row: miningpoolpool.Pool) => row.EntID
  },
  {
    name: 'MININGPOOLTYPE',
    label: t('MSG_MININGPOOLTYPE'),
    sortable: true,
    field: (row: miningpoolpool.Pool) => row.MiningpoolType
  },
  {
    name: 'NAME',
    label: t('MSG_NAME'),
    sortable: true,
    field: (row: miningpoolpool.Pool) => row.Name
  },
  {
    name: 'SITE',
    label: t('MSG_SITE'),
    sortable: true,
    field: (row: miningpoolpool.Pool) => row.Site
  },
  {
    name: 'LOGO',
    label: t('MSG_LOGO'),
    sortable: true,
    field: (row: miningpoolpool.Pool) => row.Logo
  },
  {
    name: 'DESCRIPTION',
    label: t('MSG_DESCRIPTION'),
    sortable: true,
    field: (row: miningpoolpool.Pool) => row.Description
  }
])
</script>
