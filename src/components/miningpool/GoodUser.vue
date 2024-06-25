<template>
  <q-table
    dense
    flat
    :title='$t("MSG_MININGPOOL_GOODUSERS")'
    :rows='goodusers'
    :columns='columns'
    row-key='ID'
    :rows-per-page-options='[100]'
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
        <span>{{ $t('MSG_MININGPOOL_GOODUSER') }}</span>
      </q-card-section>
      <q-card-section>
        <CoinPicker v-model:coin-type-id='target.PoolCoinTypeID' :label='$t("MSG_POOLCOINTYPEID")' />
        <RootUserPicker v-model:id='target.RootUserID' :label='$t("MSG_ROOTUSERID")' />
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
import { miningpoolgooduser, notify } from 'src/npoolstore'

const CoinPicker = defineAsyncComponent(() => import('src/components/miningpool/CoinPicker.vue'))
const RootUserPicker = defineAsyncComponent(() => import('src/components/miningpool/RootUserPicker.vue'))

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const LoadingButton = defineAsyncComponent(() => import('src/components/button/LoadingButton.vue'))

const gooduserInfo = miningpoolgooduser.useMiningpoolGoodUserStore()
const goodusers = computed(() => gooduserInfo.goodusers())

const target = ref({} as miningpoolgooduser.GoodUser)
const showing = ref(false)

const onCreate = () => {
  showing.value = true
}

const onSubmit = (done: () => void) => {
  showing.value = false
  createGoodUser(done)
}

const onCancel = () => {
  showing.value = false
}

const onMenuHide = () => {
  target.value = {} as miningpoolgooduser.GoodUser
  showing.value = false
}

const createGoodUser = (done: () => void) => {
  gooduserInfo.createGoodUser({
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

const getGoodUsers = (offset: number, limit: number) => {
  gooduserInfo.getGoodUsers({
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
  }, (error: boolean, goodusers?: Array<miningpoolgooduser.GoodUser>) => {
    if (error || !goodusers?.length) {
      return
    }
    getGoodUsers(offset + limit, limit)
  })
}

onMounted(() => {
  if (!goodusers.value.length) {
    getGoodUsers(0, 100)
  }
})

const columns = computed(() => [
  {
    name: 'ID',
    label: t('MSG_ID'),
    sortable: true,
    field: (row: miningpoolgooduser.GoodUser) => row.ID
  },
  {
    name: 'ENTID',
    label: t('MSG_ENTID'),
    sortable: true,
    field: (row: miningpoolgooduser.GoodUser) => row.EntID
  },
  {
    name: 'ROOTUSERID',
    label: t('MSG_ROOTUSERID'),
    sortable: true,
    field: (row: miningpoolgooduser.GoodUser) => row.RootUserID
  },
  {
    name: 'NAME',
    label: t('MSG_NAME'),
    sortable: true,
    field: (row: miningpoolgooduser.GoodUser) => row.Name
  },
  {
    name: 'READPAGELINK',
    label: t('MSG_READPAGELINK'),
    sortable: true,
    field: (row: miningpoolgooduser.GoodUser) => row.ReadPageLink
  },
  {
    name: 'POOLID',
    label: t('MSG_POOLID'),
    sortable: true,
    field: (row: miningpoolgooduser.GoodUser) => row.PoolID
  },
  {
    name: 'MININGPOOLTYPE',
    label: t('MSG_MININGPOOLTYPE'),
    sortable: true,
    field: (row: miningpoolgooduser.GoodUser) => row.MiningpoolType
  },
  {
    name: 'POOLCOINTYPEID',
    label: t('MSG_POOLCOINTYPEID'),
    sortable: true,
    field: (row: miningpoolgooduser.GoodUser) => row.PoolCoinTypeID
  },
  {
    name: 'COINTYPEID',
    label: t('MSG_COINTYPEID'),
    sortable: true,
    field: (row: miningpoolgooduser.GoodUser) => row.CoinTypeID
  },
  {
    name: 'COINTYPE',
    label: t('MSG_COINTYPE'),
    sortable: true,
    field: (row: miningpoolgooduser.GoodUser) => row.CoinType
  },
  {
    name: 'REVENUETYPE',
    label: t('MSG_REVENUETYPE'),
    sortable: true,
    field: (row: miningpoolgooduser.GoodUser) => row.RevenueType
  },
  {
    name: 'FEERATIO',
    label: t('MSG_FEERATIO'),
    sortable: true,
    field: (row: miningpoolgooduser.GoodUser) => row.FeeRatio
  },
  {
    name: 'UPDATEDAT',
    label: t('MSG_CREATEDAT'),
    sortable: true,
    field: (row: miningpoolgooduser.GoodUser) => row.CreatedAt
  },
  {
    name: 'CREATEDAT',
    label: t('MSG_UPDATEDAT'),
    sortable: true,
    field: (row: miningpoolgooduser.GoodUser) => row.UpdatedAt
  }
])
</script>
