<template>
  <q-table
    dense
    flat
    :title='$t("MSG_GOOD_BENEFIT_ADDRESSES")'
    :rows='displayGbAccounts'
    row-key='ID'
    :rows-per-page-options='[100]'
    @row-click='(evt, row, index) => onRowClick(row as GoodBenefitAccount)'
  >
    <template #top>
      <div class='row justify-end table-right'>
        <TableHeaderFilter v-model:backup='backup' v-model:blocked='blocked' v-model:active='active' v-model:locked='locked' />
        <div class='row indent flat align-bottom'>
          <q-btn
            dense
            flat
            class='btn flat'
            :label='$t("MSG_CREATE")'
            @click='onCreate'
          />
        </div>
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
        <span>{{ $t('MSG_CREATE_GOOD_BENEFIT_ACCOUNT') }}</span>
      </q-card-section>
      <q-card-section v-if='!updating'>
        <GoodSelector v-model:id='target.GoodID' />
        <!-- <q-input
          type='number'
          min='1'
          max='24'
          v-model='target.BenefitIntervalHours'
          :label='$t("MSG_ADDRESS")'
          :suffix='$t("MSG_HOUR")'
        /> -->
      </q-card-section>
      <q-card-section v-if='updating'>
        <div><span>{{ $t("MSG_ID") }}: {{ target?.ID }}</span></div>
        <div><span>{{ $t("MSG_ACCOUNT_ID") }}: {{ target?.AccountID }}</span></div>
        <div><span>{{ $t("MSG_GOOD_ID") }}: {{ target?.GoodID }}</span></div>
        <div><span>{{ $t("MSG_GOOD_NAME") }}: {{ target?.GoodName }}</span></div>
        <div><span>{{ $t("MSG_ADDRESS") }}: {{ target?.Address }}</span></div>
        <div><span>{{ $t("MSG_COIN_NAME") }}: {{ target?.CoinName }}</span></div>
        <div>
          <q-toggle dense v-model='target.Backup' :label='$t("MSG_BACKUP")' />
        </div>
        <div>
          <q-toggle dense v-model='target.Blocked' :label='$t("MSG_BLOCKED")' />
        </div>
        <div>
          <q-toggle dense v-model='target.Active' :label='$t("MSG_ACTIVE")' />
        </div>
        <div>
          <q-toggle dense v-model='target.Locked' :label='$t("MSG_LOCKED")' />
        </div>
      </q-card-section>
      <q-item class='row'>
        <LoadingButton loading :label='$t("MSG_SUBMIT")' @click='onSubmit' />
        <q-btn class='btn round' :label='$t("MSG_CANCEL")' @click='onCancel' />
      </q-item>
    </q-card>
  </q-dialog>
</template>

<script setup lang='ts'>
import { GoodBenefitAccount, NotifyType, useChurchGoodBenefitAccountStore } from 'npool-cli-v4'
import { getGoodBenefitAccounts } from 'src/api/account'
import { computed, defineAsyncComponent, onMounted, ref } from 'vue'

const GoodSelector = defineAsyncComponent(() => import('src/components/good/GoodSelector.vue'))
const LoadingButton = defineAsyncComponent(() => import('src/components/button/LoadingButton.vue'))
const TableHeaderFilter = defineAsyncComponent(() => import('src/components/account/TableHeaderFilter.vue'))

const gb = useChurchGoodBenefitAccountStore()
const gbAccounts = computed(() => gb.GoodBenefitAccounts.GoodBenefitAccounts)

const backup = ref(null)
const blocked = ref(null)
const active = ref(null)
const locked = ref(null)

const displayGbAccounts = computed(() => gbAccounts.value.filter((el) => {
  let flag = true
  if (backup.value !== null) {
    flag = flag && el.Backup === backup.value
  }
  if (blocked.value !== null) {
    flag = flag && el.Blocked === blocked.value
  }
  if (active.value !== null) {
    flag = flag && el.Active === active.value
  }
  if (locked.value !== null) {
    flag = flag && el.Locked === locked.value
  }
  return flag
}))
const showing = ref(false)
const updating = ref(false)
const target = ref({} as GoodBenefitAccount)

const onMenuHide = () => {
  showing.value = false
  target.value = {} as GoodBenefitAccount
}

const onCreate = () => {
  showing.value = true
  updating.value = false
}

const onCancel = () => {
  onMenuHide()
}

const onRowClick = (row: GoodBenefitAccount) => {
  target.value = { ...row }
  showing.value = true
  updating.value = true
}

const onSubmit = (done: () => void) => {
  updating.value ? updateGoodBenefitAccount(done) : createGoodBenefitAccount(done)
}

const createGoodBenefitAccount = (done: () => void) => {
  gb.createGoodBenefitAccount({
    ...target.value,
    Message: {
      Error: {
        Title: 'MSG_CREATE_GOOD_BENEFIT',
        Message: 'MSG_CREATE_GOOD_BENEFIT_FAIL',
        Popup: true,
        Type: NotifyType.Error
      },
      Info: {
        Title: 'MSG_CREATE_GOOD_BENEFIT',
        Popup: true,
        Type: NotifyType.Success
      }
    }
  }, (account: GoodBenefitAccount, error: boolean) => {
    done()
    if (error) {
      return
    }
    onMenuHide()
  })
}

const updateTarget = computed(() => {
  return {
    ID: target.value.ID,
    Backup: target.value.Backup,
    Active: target.value.Active,
    Blocked: target.value.Blocked,
    Locked: target.value.Locked
  }
})

const updateGoodBenefitAccount = (done: () => void) => {
  gb.updateGoodBenefitAccount({
    ...updateTarget.value,
    Message: {
      Error: {
        Title: 'MSG_UPDATE_GOOD_BENEFIT',
        Message: 'MSG_UPDATE_GOOD_BENEFIT_FAIL',
        Popup: true,
        Type: NotifyType.Error
      },
      Info: {
        Title: 'MSG_UPDATE_GOOD_BENEFIT',
        Popup: true,
        Type: NotifyType.Success
      }
    }
  }, (account: GoodBenefitAccount, error: boolean) => {
    done()
    if (error) {
      return
    }
    onMenuHide()
  })
}

onMounted(() => {
  if (gbAccounts.value.length === 0) {
    getGoodBenefitAccounts(0, 500)
  }
})
</script>
<style lang='sass' scoped>
.table-right
  width: 100%
  ::v-deep .button
    line-height: 30px
    height: 30px
    margin-left: 10px
</style>
