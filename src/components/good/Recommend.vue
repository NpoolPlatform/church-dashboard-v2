<template>
  <q-table
    dense
    flat
    :title='$t("MSG_APP_GOODS")'
    :rows='appGoods'
    row-key='ID'
    ::rows-per-page-options='[100]'
    selection='single'
    :columns='appGoodsColumns'
    v-model:selected='selectedGood'
  />

  <q-table
    dense
    flat
    :title='$t("MSG_APP_GOOD_RECOMMENDS")'
    :rows='recommends'
    row-key='ID'
    ::rows-per-page-options='[100]'
    @row-click='(evt, row, index) => onRowClick(row as Recommend)'
  >
    <template #top-right>
      <div class='row indent flat'>
        <q-btn
          dense
          flat
          class='btn flat'
          :label='$t("MSG_CREATE")'
          :disable='selectedGood.length === 0'
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
        <span>{{ $t('MSG_CREATE_RECOMMEND') }}</span>
      </q-card-section>
      <q-card-section>
        <span> {{ updating? target.GoodName : selectedGood[0]?.GoodName }}</span>
      </q-card-section>
      <q-card-section>
        <q-input v-model='target.Message' :label='$t("MSG_MESSAGE")' />
      </q-card-section>
      <q-card-section>
        <q-input v-model.number='target.RecommendIndex' :label='$t("MSG_RECOMMEND_INDEX")' />
      </q-card-section>
      <q-item class='row'>
        <LoadingButton loading :label='$t("MSG_SUBMIT")' @click='onSubmit' />
        <q-btn class='btn round' :label='$t("MSG_CANCEL")' @click='onCancel' />
      </q-item>
    </q-card>
  </q-dialog>
  <q-card>
    <q-card-section class='bg-primary text-white'>
      {{ $t('MSG_ADVERTISEMENT_POSITION') }}
    </q-card-section>
  </q-card>
</template>

<script setup lang='ts'>
import { useLocalApplicationStore } from 'src/localstore'
import { useChurchAppGoodStore, AppGood, Recommend, NotifyType, useLocalUserStore, useChurchRecommendStore, formatTime } from 'npool-cli-v4'
import { computed, defineAsyncComponent, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { getAppGoods, getAppRecommends } from 'src/api/good'
// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const LoadingButton = defineAsyncComponent(() => import('src/components/button/LoadingButton.vue'))

const app = useLocalApplicationStore()
const appID = computed(() => app.AppID)

const appGood = useChurchAppGoodStore()
const appGoods = computed(() => appGood.getGoodsByAppID(appID.value))
const selectedGood = ref([] as Array<AppGood>)

const recommend = useChurchRecommendStore()
const recommends = computed(() => recommend.getRecommendsByAppID(appID.value))

const logined = useLocalUserStore()
const target = ref({
  RecommenderID: logined.User?.ID
} as Recommend)

const showing = ref(false)
const updating = ref(false)

const onCreate = () => {
  updating.value = false
  showing.value = true
  target.value.GoodID = selectedGood.value[0]?.GoodID
}

const onRowClick = (row: Recommend) => {
  updating.value = true
  showing.value = true
  target.value = { ...row }
}

const onCancel = () => {
  onMenuHide()
}

const onMenuHide = () => {
  target.value = {
    RecommenderID: logined.User?.ID
  } as Recommend
  showing.value = false
}

const onSubmit = (done: () => void) => {
  updating.value ? updateAppRecommend(done) : createAppRecommend(done)
}

const createAppRecommend = (done: () => void) => {
  recommend.createAppRecommend({
    TargetAppID: appID.value,
    ...target.value,
    NotifyMessage: {
      Error: {
        Title: t('MSG_CREATE_RECOMMEND'),
        Message: t('MSG_CREATE_RECOMMEND_FAIL'),
        Popup: true,
        Type: NotifyType.Error
      },
      Info: {
        Title: t('MSG_CREATE_RECOMMEND'),
        Message: t('MSG_CREATE_RECOMMEND_SUCCESS'),
        Popup: true,
        Type: NotifyType.Success
      }
    }
  }, (g: Recommend, error: boolean) => {
    done()
    if (error) {
      return
    }
    onMenuHide()
  })
}

const updateAppRecommend = (done: () => void) => {
  recommend.updateAppRecommend({
    TargetAppID: appID.value,
    ID: target.value.ID,
    Message: target.value.Message,
    RecommendIndex: target.value.RecommendIndex,
    NotifyMessage: {
      Error: {
        Title: t('MSG_UPDATE_RECOMMEND'),
        Message: t('MSG_UPDATE_RECOMMEND_FAIL'),
        Popup: true,
        Type: NotifyType.Error
      },
      Info: {
        Title: t('MSG_UPDATE_RECOMMEND'),
        Message: t('MSG_UPDATE_RECOMMEND_SUCCESS'),
        Popup: true,
        Type: NotifyType.Success
      }
    }
  }, (g: Recommend, error: boolean) => {
    done()
    if (error) {
      return
    }
    onMenuHide()
  })
}

watch(appID, () => {
  prepare()
})

onMounted(() => {
  prepare()
})

const prepare = () => {
  if (recommends.value.length === 0) {
    getAppRecommends(0, 500)
  }
  if (appGoods.value.length === 0) {
    getAppGoods(0, 500)
  }
}

const appGoodsColumns = computed(() => [
  {
    name: 'ID',
    label: t('MSG_ID'),
    sortable: true,
    field: (row: AppGood) => row.ID
  },
  {
    name: 'GOODID',
    label: t('MSG_GOODID'),
    sortable: true,
    field: (row: AppGood) => row.GoodID
  },
  {
    name: 'GOODNAME',
    label: t('MSG_GOODNAME'),
    sortable: true,
    field: (row: AppGood) => row.GoodName
  },
  {
    name: 'GOODTYPE',
    label: t('MSG_GOOD_TYPE'),
    sortable: true,
    field: (row: AppGood) => row.GoodType
  },
  {
    name: 'ONLINE',
    label: t('MSG_ONLINE'),
    sortable: true,
    field: (row: AppGood) => row.Online
  },
  {
    name: 'VISIBLE',
    label: t('MSG_VISIBLE'),
    sortable: true,
    field: (row: AppGood) => row.Visible
  },
  {
    name: 'GOODPRICE',
    label: t('MSG_GOOD_PRICE'),
    sortable: true,
    field: (row: AppGood) => row.Price
  },
  {
    name: 'GOODUNIT',
    label: t('MSG_GOOD_UNIT'),
    sortable: true,
    field: (row: AppGood) => row.Unit
  },
  {
    name: 'GOODTOTAL',
    label: t('MSG_GOOD_TOTAL'),
    sortable: true,
    field: (row: AppGood) => row.Total
  },
  {
    name: 'GOODSOLD',
    label: t('MSG_GOOD_SOLD'),
    sortable: true,
    field: (row: AppGood) => row.Sold
  },
  {
    name: 'GOODLOCKED',
    label: t('MSG_GOOD_LOCKED'),
    sortable: true,
    field: (row: AppGood) => row.Locked
  },
  {
    name: 'GOODINSERVICE',
    label: t('MSG_GOOD_INSERVICE'),
    sortable: true,
    field: (row: AppGood) => row.InService
  },
  {
    name: 'COINNAME',
    label: t('MSG_COINNAME'),
    sortable: true,
    field: (row: AppGood) => row.CoinName
  },
  {
    name: 'BENEFITTYPE',
    label: t('MSG_BENEFITTYPE'),
    sortable: true,
    field: (row: AppGood) => row.BenefitType
  },
  {
    name: 'STARTAT',
    label: t('MSG_STARTAT'),
    sortable: true,
    field: (row: AppGood) => formatTime(row.StartAt)
  }
])
</script>
