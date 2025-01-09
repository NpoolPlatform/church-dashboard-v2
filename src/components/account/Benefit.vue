<template>
  <q-table
    dense
    flat
    :title='$t("MSG_GOOD_BENEFIT_ADDRESSES")'
    :rows='displayGbAccounts'
    row-key='ID'
    :rows-per-page-options='[20]'
    @row-click='(evt, row, index) => onRowClick(row as goodbenefitaccount.Account)'
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
      <q-card-section v-if='!updating'>
        <GoodSelector v-model:good-id='target.GoodID' :ignore-good-types='[goodbase.GoodType.Pledge]' />
        <CoinPicker v-model:coin-type-id='target.CoinTypeID' />
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
        <q-btn class='btn round' :loading='submitting' :label='$t("MSG_SUBMIT")' @click='onSubmit' />
        <q-btn class='btn alt round' :label='$t("MSG_CANCEL")' @click='onCancel' />
      </q-item>
    </q-card>
  </q-dialog>
</template>

<script setup lang='ts'>
import { computed, defineAsyncComponent, onMounted, ref, watch } from 'vue'
import { goodbenefitaccount, sdk, goodbase } from 'src/npoolstore'

const GoodSelector = defineAsyncComponent(() => import('src/components/good/GoodSelector.vue'))
const CoinPicker = defineAsyncComponent(() => import('src/components/coin/CoinPicker.vue'))
const TableHeaderFilter = defineAsyncComponent(() => import('src/components/account/TableHeaderFilter.vue'))

const accounts = sdk.goodBenefitAccounts

const backup = ref(null)
const blocked = ref(null)
const active = ref(null)
const locked = ref(null)

const displayGbAccounts = computed(() => accounts.value.filter((el) => {
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
const submitting = ref(false)
const target = ref({} as goodbenefitaccount.Account)

const onMenuHide = () => {
  showing.value = false
  submitting.value = false
  target.value = {} as goodbenefitaccount.Account
}

const onCreate = () => {
  showing.value = true
  updating.value = false
}

const onCancel = () => {
  onMenuHide()
}

const onRowClick = (row: goodbenefitaccount.Account) => {
  target.value = { ...row }
  showing.value = true
  updating.value = true
}

const onSubmit = () => {
  submitting.value = true
  updating.value ? updateGoodBenefitAccount() : createGoodBenefitAccount()
}

const createGoodBenefitAccount = () => {
  sdk.adminCreateGoodBenefitAccount(target.value, (error: boolean) => {
    submitting.value = false
    if (error) return
    onMenuHide()
  })
}

const updateGoodBenefitAccount = () => {
  sdk.adminUpdateGoodBenefitAccount(target.value, (error: boolean) => {
    if (error) return
    onMenuHide()
  })
}

const goodCoins = computed(() => sdk.goodCoins.value.filter((el) => el.GoodType !== goodbase.GoodType.Pledge))

const coinTypeIDs = computed(() => goodCoins.value?.filter((el) => el.GoodID === target.value?.GoodID)?.map((cl) => cl.CoinTypeID))
const displayCoinTypeIds = ref(coinTypeIDs.value)
watch(() => target.value?.GoodID, () => {
  displayCoinTypeIds.value = coinTypeIDs.value
})

const coins = sdk.coins
onMounted(() => {
  if (!accounts.value.length) {
    sdk.adminGetGoodBenefitAccounts(0, 0)
  }
  if (!goodCoins.value.length) {
    sdk.getGoodCoins(0, 0)
  }
  if (!coins.value.length) {
    sdk.getCoins(0, 0)
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
