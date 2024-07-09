<template>
  <q-table
    dense
    flat
    :title='$t("MSG_REQUIRED_APP_GOODS")'
    :rows='requireds'
    row-key='ID'
    :rows-per-page-options='[100]'
    :columns='columns'
    @row-click='(evt, row, index) => onRowClick(row as requiredappgood.Required)'
  >
    <template #top-right>
      <div class='row indent flat'>
        <q-btn
          dense
          flat
          class='btn flat'
          :label='$t("MSG_CREATE")'
          @click='onCreateClick'
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
      <q-card-section v-if='!updating'>
        <div>{{ $t('MSG_SELECT_MAIN_APP_GOOD') }}</div>
        <AppGoodSelector v-model:app-good-id='target.MainAppGoodID' />
      </q-card-section>
      <q-card-section v-if='!updating'>
        <div>{{ $t('MSG_SELECT_REQUIRED_APP_GOOD') }}</div>
        <AppGoodSelector v-model:app-good-id='target.RequiredAppGoodID' />
      </q-card-section>
      <q-card-section>
        <div><q-toggle dense v-model='target.Must' :label='$t("MSG_MUST")' /></div>
      </q-card-section>
      <q-item class='row'>
        <q-btn class='btn round' :loading='submitting' :label='$t("MSG_SUBMIT")' @click='onSubmit' />
        <q-btn class='btn alt round' :label='$t("MSG_CANCEL")' @click='onCancel' />
      </q-item>
    </q-card>
  </q-dialog>
</template>

<script setup lang='ts'>
import { computed, onMounted, ref, defineAsyncComponent, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { utils, sdk, requiredappgood } from 'src/npoolstore'

const AppGoodSelector = defineAsyncComponent(() => import('src/components/good/AppGoodSelector.vue'))

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const requireds = sdk.requiredAppGoods
const target = ref({} as requiredappgood.Required)

const showing = ref(false)
const updating = ref(false)
const submitting = ref(false)

const onCreateClick = () => {
  showing.value = true
  updating.value = false
}

const onSubmit = () => {
  updating.value ? updateRequiredGood() : createRequiredGood()
}

const onCancel = () => {
  onMenuHide()
}

const createRequiredGood = () => {
  sdk.adminCreateRequiredAppGood(target.value, (error) => {
    if (error) return
    onMenuHide()
  })
}

const updateRequiredGood = () => {
  sdk.adminUpdateRequiredAppGood(target.value, (error) => {
    if (error) return
    onMenuHide()
  })
}

const onRowClick = (required: requiredappgood.Required) => {
  showing.value = true
  updating.value = true
  target.value = required
}

const onMenuHide = () => {
  showing.value = false
  submitting.value = false
  target.value = {} as requiredappgood.Required
}

watch(sdk.AppID, () => {
  if (!requireds.value.length) {
    sdk.adminGetRequiredAppGoods(0, 0)
  }
})

onMounted(() => {
  if (!requireds.value.length) {
    sdk.adminGetRequiredAppGoods(0, 0)
  }
})

const columns = computed(() => [
  {
    name: 'ID',
    label: t('MSG_ID'),
    sortable: true,
    field: (row: requiredappgood.Required) => row.ID
  },
  {
    name: 'EntID',
    label: t('MSG_ENT_ID'),
    sortable: true,
    field: (row: requiredappgood.Required) => row.EntID
  },
  {
    name: 'AppID',
    label: t('MSG_APP_ID'),
    sortable: true,
    field: (row: requiredappgood.Required) => row.AppID
  },
  {
    name: 'MainGoodID',
    label: t('MSG_MAIN_GOOD_ID'),
    sortable: true,
    field: (row: requiredappgood.Required) => row.MainGoodID
  },
  {
    name: 'MainAppGoodID',
    label: t('MSG_MAIN_APP_GOOD_ID'),
    sortable: true,
    field: (row: requiredappgood.Required) => row.MainAppGoodID
  },
  {
    name: 'MainAppGoodName',
    label: t('MSG_MAIN_APP_GOOD_NAME'),
    sortable: true,
    field: (row: requiredappgood.Required) => row.MainAppGoodName
  },
  {
    name: 'RequiredGoodID',
    label: t('MSG_REQUIRE_APP_GOOD_NAME'),
    sortable: true,
    field: (row: requiredappgood.Required) => row.RequiredGoodID
  },
  {
    name: 'RequiredAppGoodID',
    label: t('MSG_REQUIRE_APP_GOOD_ID'),
    sortable: true,
    field: (row: requiredappgood.Required) => row.RequiredAppGoodID
  },
  {
    name: 'RequiredAppGoodName',
    label: t('MSG_REQUIRE_APP_GOOD_NAME'),
    sortable: true,
    field: (row: requiredappgood.Required) => row.RequiredAppGoodName
  },
  {
    name: 'CreatedAt',
    label: t('MSG_CREATED_AT'),
    sortable: true,
    field: (row: requiredappgood.Required) => utils.formatTime(row.CreatedAt)
  }
])
</script>

<style lang='sass' scoped>
</style>
