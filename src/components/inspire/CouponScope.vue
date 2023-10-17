<template>
  <q-table
    dense
    flat
    :title='$t("MSG_COUPON_SCOPE")'
    :rows='displayScopes'
    row-key='ID'
    :rows-per-page-options='[100]'
    selection='single'
    :columns='columns'
    v-model:selected='selectedScopes'
  >
    <template #top-right>
      <div class='row indent flat'>
        <q-input
          dense
          flat
          class='small'
          v-model='username'
          :label='$t("MSG_USERNAME")'
        />
      </div>
      <q-btn
        dense
        flat
        class='btn flat'
        :label='$t("MSG_DELETE")'
        :disable='selectedScopes?.length === 0'
        @click='onDelete'
      />
      <q-btn
        dense
        flat
        class='btn flat'
        :label='$t("MSG_CREATE")'
        @click='onCreate'
      />
    </template>
  </q-table>

  <q-dialog
    v-model='showing'
    @hide='onMenuHide'
    position='right'
  >
    <q-card class='popup-menu'>
      <q-card-section>
        <span>{{ $t('MSG_COUPON') }}</span>
      </q-card-section>
      <q-card-section>
        <AppGoodSelector v-model:id='target.AppGoodID' :label='"MSG_APP_GOOD"' />
        <CouponSelector v-model:id='target.CouponID' />
        <q-select :options='coupon.CouponScopes' v-model='_scope' disable :label='$t("MSG_COUPON_SCOPE")' />
      </q-card-section>
      <q-item class='row'>
        <LoadingButton loading :label='$t("MSG_SUBMIT")' @click='onSubmit' />
        <q-btn class='btn round' :label='$t("MSG_CANCEL")' @click='onCancel' />
      </q-item>
    </q-card>
  </q-dialog>
</template>

<script setup lang='ts'>
import { computed, defineAsyncComponent, onMounted, ref, watch } from 'vue'
import { couponscope, coupon, sdk, utils } from 'src/npoolstore'
import { AppID } from 'src/npoolstore/sdk'
import { useI18n } from 'vue-i18n'
import { CouponScope } from 'src/npoolstore/inspire/coupon'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const CouponSelector = defineAsyncComponent(() => import('src/components/inspire/CouponSelector.vue'))
const AppGoodSelector = defineAsyncComponent(() => import('src/components/good/AppGoodSelector.vue'))
const LoadingButton = defineAsyncComponent(() => import('src/components/button/LoadingButton.vue'))

const scope = couponscope.useScopeStore()
const username = ref('')
const scopes = computed(() => scope.scopes(undefined))
const displayScopes = computed(() => scope.scopes(undefined).filter((el) => {
  return el.AppGoodID?.includes(username.value) ||
           el.CouponID?.includes(username.value)
}))

const target = ref({} as couponscope.Scope)
const showing = ref(false)

const onCreate = () => {
  target.value = {} as couponscope.Scope
  showing.value = true
}
const onMenuHide = () => {
  showing.value = false
  target.value = {} as couponscope.Scope
}
const onCancel = () => {
  onMenuHide()
}

const _coupon = coupon.useCouponStore()
const _scope = computed(() => _coupon.coupon(undefined, target.value?.CouponID)?.CouponScope)

const onSubmit = (done: () => void) => {
  target.value.CouponScope = _scope.value as CouponScope
  sdk.createScope(target.value, (error: boolean) => {
    done()
    if (error) {
      return
    }
    onMenuHide()
  })
}

const selectedScopes = ref([] as Array<couponscope.Scope>)
const onDelete = () => {
  sdk.deleteScope(selectedScopes.value?.[0], () => {
    // TODO
  })
}

watch(AppID, () => {
  if (!scopes.value?.length) {
    sdk.getNAppScopes(0, 0)
  }
})

onMounted(() => {
  if (!scopes.value?.length) {
    sdk.getNAppScopes(0, 0)
  }
})

const columns = computed(() => [
  {
    name: 'ID',
    label: t('MSG_ID'),
    sortable: true,
    field: (row: couponscope.Scope) => row.ID
  },
  {
    name: 'AppID',
    label: t('MSG_APP_ID'),
    sortable: true,
    field: (row: couponscope.Scope) => row.AppID
  },
  {
    name: 'AppGoodID',
    label: t('MSG_APP_GOOD_ID'),
    sortable: true,
    field: (row: couponscope.Scope) => row.AppGoodID
  },
  {
    name: 'GoodName',
    label: t('MSG_GOOD_NAME'),
    sortable: true,
    field: (row: couponscope.Scope) => row.GoodName
  },
  {
    name: 'Type',
    label: t('MSG_TYPE'),
    sortable: true,
    field: (row: couponscope.Scope) => row.CouponType
  },
  {
    name: 'Scope',
    label: t('MSG_COUPON_SCOPE'),
    sortable: true,
    field: (row: couponscope.Scope) => row.CouponScope
  },
  {
    name: 'CouponID',
    label: t('MSG_COUPON_ID'),
    sortable: true,
    field: (row: couponscope.Scope) => row.CouponID
  },
  {
    name: 'CouponName',
    label: t('MSG_COUPON_NAME'),
    sortable: true,
    field: (row: couponscope.Scope) => row.CouponName
  },
  {
    name: 'CouponScope',
    label: t('MSG_SCOPE'),
    sortable: true,
    field: (row: couponscope.Scope) => row.CouponScope
  },
  {
    name: 'CreatedAt',
    label: t('MSG_CREATED_AT'),
    sortable: true,
    field: (row: couponscope.Scope) => utils.formatTime(row.CreatedAt)
  }
])

</script>
