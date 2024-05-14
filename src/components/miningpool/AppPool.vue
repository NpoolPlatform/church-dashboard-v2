<!-- <template>
  <q-table
    dense
    flat
    :title='$t("MSG_APP_POOL")'
    :rows='pools'
    :columns='poolColums'
    row-key='ID'
    selection='single'
    :rows-per-page-options='[100]'
    v-model:selected='selectedPool'
    @row-click='(evt, row, index) => onRowClick(row as miningpoolpool.Pool)'
  >
    <template #top-right>
      <div class='row indent flat'>
        <q-input
          dense
          flat
          class='small'
          v-model='poolname'
          :label='$t("MSG_POOL_NAME")'
        />
        <div v-if='selectedPool.length === 0' class='column justify-center'>
          <span class='warning'>{{ $t('MSG_SELECT_POOL') }}</span>
        </div>
        <q-btn
          dense
          flat
          class='btn flat'
          :label='$t("MSG_AUTHORIZE")'
          @click='onAuthorizeClick'
          :disable='selectedPool.length === 0'
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
        <span>{{ $t('MSG_POOL_DETAIL') }}</span>
      </q-card-section>
      <q-card-section>
        <pre>{{ JSON.stringify(target,null,4) }}</pre>
      </q-card-section>
      <q-card-section>
        <BrandPicker v-model:id='target.ID' />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang='ts'>
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { miningpoolpool, miningpoolapppool, notify } from 'src/npoolstore'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const pool = miningpoolpool.useMiningpoolPoolStore()
const pools = computed(() => pool.pools())
const selectedPool = ref([] as Array<miningpoolapppool.Pool>)

const poolname = ref('')
const target = ref({} as miningpoolapppool.Pool)

const showing = ref(false)

const onRowClick = (row: miningpoolapppool.Pool) => {
  showing.value = true
  target.value = { ...row }
}

onMounted(() => {
  if (!pools.value.length) {
    adminGetPools(0, 100)
  }
})

const adminGetPools = (offset: number, limit: number) => {
  pool.adminGetPools({
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
    adminGetPools(offset + limit, limit)
  })
}

const poolColums = computed(() => [
  {
    name: 'ID',
    label: t('MSG_ID'),
    sortable: true,
    field: (row: miningpoolapppool.Pool) => row.ID
  },
  {
    name: 'ENTID',
    label: t('MSG_ENT_ID'),
    sortable: true,
    field: (row: miningpoolapppool.Pool) => row.EntID
  },
  {
    name: 'MININGPOOLTYPE',
    label: t('MSG_MININGPOOLTYPE'),
    sortable: true,
    field: (row: miningpoolapppool.Pool) => row.MiningpoolType
  },
  {
    name: 'NAME',
    label: t('MSG_NAME'),
    sortable: true,
    field: (row: miningpoolapppool.Pool) => row.Name
  },
  {
    name: 'SITE',
    label: t('MSG_SITE'),
    sortable: true,
    field: (row: miningpoolapppool.Pool) => row.Site
  },
  {
    name: 'LOGO',
    label: t('MSG_LOGO'),
    sortable: true,
    field: (row: miningpoolapppool.Pool) => row.Logo
  },
  {
    name: 'DESCRIPTION',
    label: t('MSG_DESCRIPTION'),
    sortable: true,
    field: (row: miningpoolapppool.Pool) => row.Description
  }
])
</script> -->
