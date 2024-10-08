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
        <GoodSelector v-model:good-id='target.GoodID' :label='"MSG_GOOD"' />
        <CouponSelector v-model:id='target.CouponID' />
        <q-select
          :options='[
            coupon.CouponScope.Whitelist,
            coupon.CouponScope.Blacklist
          ]'
          v-model='target.CouponScope'
          :label='$t("MSG_COUPON_SCOPE")'
        />
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
import { useI18n } from 'vue-i18n'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const CouponSelector = defineAsyncComponent(() => import('src/components/inspire/CouponSelector.vue'))
const GoodSelector = defineAsyncComponent(() => import('src/components/good/GoodSelector.vue'))
const LoadingButton = defineAsyncComponent(() => import('src/components/button/LoadingButton.vue'))

const scope = couponscope.useScopeStore()
const username = ref('')
const scopes = computed(() => scope.scopes())
const displayScopes = computed(() => scope.scopes().filter((el) => {
  return el.GoodID?.includes(username.value) ||
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

watch(() => target.value?.CouponID, () => {
  target.value.CouponScope = _coupon.getCouponByEntID(undefined, target.value?.CouponID)?.CouponScope as coupon.CouponScope
})

const onSubmit = (done: () => void) => {
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

onMounted(() => {
  if (!scopes.value?.length) {
    sdk.getScopes(0, 0)
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
    name: 'EntID',
    label: t('MSG_ENT_ID'),
    sortable: true,
    field: (row: couponscope.Scope) => row.EntID
  },
  {
    name: 'GoodID',
    label: t('MSG_GOOD_ID'),
    sortable: true,
    field: (row: couponscope.Scope) => row.GoodID
  },
  {
    name: 'GoodTitle',
    label: t('MSG_GOOD_TITLE'),
    sortable: true,
    field: (row: couponscope.Scope) => row.GoodTitle
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
    name: 'CouponDenomination',
    label: t('MSG_COUPON_DENOMINATION'),
    sortable: true,
    field: (row: couponscope.Scope) => row.CouponDenomination
  },
  {
    name: 'CouponCirculation',
    label: t('MSG_COUPON_CIRCULATION'),
    sortable: true,
    field: (row: couponscope.Scope) => row.CouponCirculation
  },
  {
    name: 'CreatedAt',
    label: t('MSG_CREATED_AT'),
    sortable: true,
    field: (row: couponscope.Scope) => utils.formatTime(row.CreatedAt)
  }
])

</script>
