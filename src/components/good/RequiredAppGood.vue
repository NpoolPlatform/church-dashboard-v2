<template>
  <q-table
    dense
    flat
    :title='$t("MSG_APP_GOODS")'
    :rows='displayGoods'
    row-key='ID'
    :rows-per-page-options='[20]'
    :columns='columns'
  >
    <template #top-right>
      <div class='row indent flat'>
        <q-input
          dense
          flat
          class='small'
          v-model='goodName'
          :label='$t("MSG_GOOD_NAME")'
        />
      </div>
    </template>
  </q-table>
  <q-table
    dense
    flat
    :title='$t("MSG_REQUIRED_APP_GOODS")'
    :rows='requireds'
    row-key='ID'
    :rows-per-page-options='[20]'
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
      <q-card-section>
        <span>{{ $t('MSG_CREATE_REQUIRED_APP_GOOD') }}</span>
      </q-card-section>
      <q-card-section>
        <div>{{ $t('MSG_SELECT_MAIN_APP_GOOD') }}</div>
        <GoodSelector v-model:good-id='mainAppGoodId' />
      </q-card-section>
      <q-card-section>
        <div>{{ $t('MSG_SELECT_REQUIRED_APP_GOOD') }}</div>
        <GoodSelector v-model:good-id='requiredAppGoodId' />
      </q-card-section>
      <q-item class='row'>
        <q-btn class='btn round' :loading='submitting' :label='$t("MSG_SUBMIT")' @click='onSubmit' />
        <q-btn class='btn alt round' :label='$t("MSG_CANCEL")' @click='onCancel' />
      </q-item>
    </q-card>
  </q-dialog>
</template>

<script setup lang='ts'>
import { computed, onMounted, ref, defineAsyncComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import { appgood, utils, sdk, requiredappgood } from 'src/npoolstore'

const GoodSelector = defineAsyncComponent(() => import('src/components/good/GoodSelector.vue'))

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const goods = sdk.appGoods
const requireds = sdk.requiredAppGoods

const goodName = ref('')
const displayGoods = computed(() => {
  const name = goodName.value.toLowerCase()
  return goods.value?.filter((el) => {
    return el.EntID.toLowerCase().includes(name) ||
          el.AppGoodName.toLowerCase().includes(name)
  })
})

onMounted(() => {
  if (!goods.value.length) {
    sdk.adminGetAppGoods(0, 0)
  }
  if (!requireds.value.length) {
    sdk.adminGetRequiredAppGoods(0, 0)
  }
})

const columns = computed(() => [
  {
    name: 'ID',
    label: t('MSG_ID'),
    sortable: true,
    field: (row: appgood.Good) => row.ID
  },
  {
    name: 'EntID',
    label: t('MSG_ENT_ID'),
    sortable: true,
    field: (row: appgood.Good) => row.EntID
  },
  {
    name: 'Name',
    label: t('MSG_APP_GOOD_NAME'),
    sortable: true,
    field: (row: appgood.Good) => row.AppGoodName
  },
  {
    name: 'GoodType',
    label: t('MSG_APP_GOOD_TYPE'),
    sortable: true,
    field: (row: appgood.Good) => row.GoodType
  },
  {
    name: 'BenefitType',
    label: t('MSG_BENEFIT_TYPE'),
    sortable: true,
    field: (row: appgood.Good) => row.BenefitType
  },
  {
    name: 'StartAt',
    label: t('MSG_START_AT'),
    sortable: true,
    field: (row: appgood.Good) => utils.formatTime(row.ServiceStartAt)
  },
  {
    name: 'CreatedAt',
    label: t('MSG_CREATED_AT'),
    sortable: true,
    field: (row: appgood.Good) => utils.formatTime(row.CreatedAt)
  }
])

const showing = ref(false)
const updating = ref(false)
const submitting = ref(false)
const target = ref({} as requiredappgood.Required)
const mainAppGoodId = ref('')
const requiredAppGoodId = ref('')

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
  sdk.adminCreateRequiredGood(target.value, (error: boolean) => {
    if (error) return
    onMenuHide()
  })
}

const updateRequiredGood = () => {
  sdk.adminUpdateRequiredGood(target.value, (error: boolean) => {
    if (error) return
    onMenuHide()
  })
}

const onRowClick = (required: requiredappgood.Required) => {
  showing.value = true
  updating.value = true
  console.log(required)
}

const onMenuHide = () => {
  showing.value = false
  submitting.value = false
  target.value = {} as requiredappgood.Required
}

</script>

<style lang='sass' scoped>
</style>
