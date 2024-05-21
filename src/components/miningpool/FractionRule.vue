<template>
  <q-table
    dense
    flat
    :title='$t("MSG_MININGPOOL_FRACTIONRULES")'
    :rows='fractionrules'
    :columns='columns'
    row-key='ID'
    :rows-per-page-options='[100]'
    @row-click='(evt, row, index) => onRowClick(row as miningpoolfractionrule.FractionRule)'
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
        <span>{{ $t('MSG_MININGPOOL_FRACTIONRULE') }}</span>
      </q-card-section>
      <q-card-section>
        <CoinPicker v-if='!updating' v-model:id='target.PoolCoinTypeID' :label='$t("MSG_POOLCOINTYPEID")' />
        <q-input type='number' v-model='target.WithdrawInterval' :label='$t("MSG_WITHDRAWINTERVAL")' />
        <q-input v-model='target.MinAmount' :label='$t("MSG_MINAMOUNT")' />
        <q-input v-model='target.WithdrawRate' :label='$t("MSG_WITHDRAWRATE")' />
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
import { miningpoolfractionrule, notify } from 'src/npoolstore'

const CoinPicker = defineAsyncComponent(() => import('src/components/miningpool/CoinPicker.vue'))

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const LoadingButton = defineAsyncComponent(() => import('src/components/button/LoadingButton.vue'))

const fractionruleInfo = miningpoolfractionrule.useMiningpoolFractionRuleStore()
const fractionrules = computed(() => fractionruleInfo.fractionrules())

const target = ref({} as miningpoolfractionrule.FractionRule)
const showing = ref(false)
const updating = ref(false)

const onCreate = () => {
  updating.value = false
  showing.value = true
}

const onRowClick = (row: miningpoolfractionrule.FractionRule) => {
  updating.value = true
  showing.value = true
  target.value = { ...row }
}

const onSubmit = (done: () => void) => {
  showing.value = false
  updating.value ? updateFractionRule(done) : createFractionRule(done)
}

const onCancel = () => {
  showing.value = false
}

const onMenuHide = () => {
  target.value = {} as miningpoolfractionrule.FractionRule
  showing.value = false
}

const updateFractionRule = (done: () => void) => {
  fractionruleInfo.updateFractionRule({
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

const createFractionRule = (done: () => void) => {
  fractionruleInfo.createFractionRule({
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

const getFractionRules = (offset: number, limit: number) => {
  fractionruleInfo.getFractionRules({
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
  }, (error: boolean, fractionrules?: Array<miningpoolfractionrule.FractionRule>) => {
    if (error || !fractionrules?.length) {
      return
    }
    getFractionRules(offset + limit, limit)
  })
}

onMounted(() => {
  if (!fractionrules.value.length) {
    getFractionRules(0, 100)
  }
})

const columns = computed(() => [
  {
    name: 'ID',
    label: t('MSG_ID'),
    sortable: true,
    field: (row: miningpoolfractionrule.FractionRule) => row.ID
  },
  {
    name: 'ENTID',
    label: t('MSG_ENTID'),
    sortable: true,
    field: (row: miningpoolfractionrule.FractionRule) => row.EntID
  },
  {
    name: 'POOLCOINTYPEID',
    label: t('MSG_POOLCOINTYPEID'),
    sortable: true,
    field: (row: miningpoolfractionrule.FractionRule) => row.PoolCoinTypeID
  },
  {
    name: 'WITHDRAWINTERVAL',
    label: t('MSG_WITHDRAWINTERVAL'),
    sortable: true,
    field: (row: miningpoolfractionrule.FractionRule) => row.WithdrawInterval
  },
  {
    name: 'MINAMOUNT',
    label: t('MSG_MINAMOUNT'),
    sortable: true,
    field: (row: miningpoolfractionrule.FractionRule) => row.MinAmount
  },
  {
    name: 'WITHDRAWRATE',
    label: t('MSG_WITHDRAWRATE'),
    sortable: true,
    field: (row: miningpoolfractionrule.FractionRule) => row.WithdrawRate
  },
  {
    name: 'MININGPOOLTYPE',
    label: t('MSG_MININGPOOLTYPE'),
    sortable: true,
    field: (row: miningpoolfractionrule.FractionRule) => row.MiningpoolType
  },
  {
    name: 'COINTYPE',
    label: t('MSG_COINTYPE'),
    sortable: true,
    field: (row: miningpoolfractionrule.FractionRule) => row.CoinType
  }
])
</script>
