<template>
  <q-table
    dense
    flat
    :title='$t("MSG_GOODS")'
    :rows='goods'
    row-key='ID'
    :loading='goodLoading'
    :rows-per-page-options='[10]'
    selection='single'
    v-model:selected='selectedGood'
  />
  <q-table
    dense
    flat
    :title='$t("MSG_APP_GOOD_RECOMMENDS")'
    :rows='recommends'
    row-key='ID'
    :loading='promotionLoading'
    :rows-per-page-options='[10]'
    @row-click='(evt, row, index) => onRowClick(row as Recommend)'
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
        <span>{{ $t('MSG_CREATE_RECOMMEND') }}</span>
      </q-card-section>
      <q-card-section>
        <span>{{ selectedGood[0]?.Title }}</span>
      </q-card-section>
      <q-card-section>
        <q-input v-model='target.Message' :label='$t("MSG_MESSAGE")' />
      </q-card-section>
      <q-item class='row'>
        <q-btn class='btn round alt' :label='$t("MSG_SUBMIT")' @click='onSubmit' />
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
import { buildGoods, NotificationType, useAdminGoodStore, useGoodStore, Recommend, GoodBase, useChurchGoodStore } from 'npool-cli-v2'
import { useLocalApplicationStore } from 'src/localstore'
import { computed, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const app = useLocalApplicationStore()
const appID = computed(() => app.AppID)

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const good = useGoodStore()
const adminGood = useAdminGoodStore()
const cgood = useChurchGoodStore()
const goods = computed(() => buildGoods(adminGood.Goods))
const goodLoading = ref(true)

const recommends = computed(() => good.Recommends)
const promotionLoading = ref(true)
const selectedGood = ref([] as Array<GoodBase>)

const target = ref({} as unknown as Recommend)

const selectedGoodID = computed(() => selectedGood.value[0]?.ID)
watch(selectedGoodID, () => {
  target.value.GoodID = selectedGoodID.value as string
})

const prepare = () => {
  cgood.getRecommends({
    TargetAppID: appID.value,
    Message: {
      Error: {
        Title: t('MSG_GET_GOOD_RECOMMENDS'),
        Message: t('MSG_GET_GOOD_RECOMMENDS_FAIL'),
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, () => {
    promotionLoading.value = false
  })
}

watch(appID, () => {
  prepare()
})

onMounted(() => {
  adminGood.getAllGoods({
    Message: {
      Error: {
        Title: t('MSG_GET_GOODS'),
        Message: t('MSG_GET_GOODS_FAIL'),
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, () => {
    goodLoading.value = false
  })

  prepare()
})

const showing = ref(false)
const updating = ref(false)

const onCreate = () => {
  if (selectedGood.value.length === 0) {
    return
  }

  updating.value = false
  showing.value = true
}

const onRowClick = (promotion: Recommend) => {
  updating.value = true
  showing.value = true
  target.value = promotion
  selectedGood.value = [good.getGoodByID(promotion.GoodID).Good.Good]
}

const onSubmit = () => {
  showing.value = false

  if (updating.value) {
    adminGood.updateRecommend({
      Info: target.value,
      Message: {
        Error: {
          Title: t('MSG_CREATE_RECOMMENDS'),
          Message: t('MSG_CREATE_RECOMMENDS_FAIL'),
          Popup: true,
          Type: NotificationType.Error
        }
      }
    }, () => {
      // TODO
    })
    return
  }

  cgood.createRecommend({
    TargetAppID: appID.value,
    Info: target.value,
    Message: {
      Error: {
        Title: t('MSG_UPDATE_RECOMMENDS'),
        Message: t('MSG_UPDATE_RECOMMENDS_FAIL'),
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, () => {
    // TODO
  })
}

const onCancel = () => {
  showing.value = false
}

const onMenuHide = () => {
  target.value = {} as unknown as Recommend
}

</script>
