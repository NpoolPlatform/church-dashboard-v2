<template>
  <FiatFeed />
  <q-table
    dense
    flat
    :rows='displayFiats'
    row-key='ID'
    :title='$t("MSG_FIATS")'
    ::rows-per-page-options='[100]'
    :columns='columns'
    @row-click='(evt, row, index) => onRowClick(row as Fiat)'
  >
    <template #top-right>
      <div class='row indent flat'>
        <q-input
          dense
          flat
          class='small'
          v-model='name'
          :label='$t("MSG")'
        />
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
        <q-input v-model='target.Name' :label='$t("MSG_NAME")' />
        <q-input v-model='target.Unit' :label='$t("MSG_UNIT")' />
        <q-input v-model='target.Logo' :label='$t("MSG_LOGO")' />
      </q-card-section>
      <q-item class='row'>
        <LoadingButton loading :label='$t("MSG_SUBMIT")' @click='onSubmit' />
        <q-btn class='btn round' :label='$t("MSG_CANCEL")' @click='onCancel' />
      </q-item>
    </q-card>
  </q-dialog>
</template>

<script setup lang='ts'>
import { useFiatStore, NotifyType, formatTime, Fiat } from 'npool-cli-v4'
import { computed, onMounted, ref, defineAsyncComponent } from 'vue'
import { useI18n } from 'vue-i18n'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const LoadingButton = defineAsyncComponent(() => import('src/components/button/LoadingButton.vue'))
const FiatFeed = defineAsyncComponent(() => import('src/components/coin/FiatFeed.vue'))

const fiat = useFiatStore()
const fiats = computed(() => fiat.fiats())

const name = ref('')
const displayFiats = computed(() => {
  return fiats.value.filter((el) => el.Name?.toLowerCase()?.includes?.(name.value?.toLowerCase()) || el.ID?.toLowerCase()?.includes(name.value?.toLowerCase()))
})

const showing = ref(false)
const updating = ref(false)
const target = ref({} as Fiat)

const onCreate = () => {
  showing.value = true
  updating.value = false
}

const onRowClick = (row: Fiat) => {
  target.value = { ...row }
  showing.value = true
  updating.value = true
}

const onCancel = () => {
  onMenuHide()
}

const onMenuHide = () => {
  showing.value = false
  target.value = {} as Fiat
}

const onSubmit = (done: () => void) => {
  updating.value ? updateFiat(done) : createFiat(done)
}

const createFiat = (done: () => void) => {
  fiat.createFiat({
    ...target.value,
    Message: {
      Error: {
        Title: 'MSG_CREATE_FIAT',
        Message: 'MSG_CREATE_FIAT_FAIL',
        Popup: true,
        Type: NotifyType.Error
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

const updateFiat = (done: () => void) => {
  fiat.updateFiat({
    ...target.value,
    Message: {
      Error: {
        Title: 'MSG_UPDATE_FIAT',
        Message: 'MSG_UPDATE_FIAT_FAIL',
        Popup: true,
        Type: NotifyType.Error
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

onMounted(() => {
  if (fiat.Fiats.Fiats.length === 0) {
    getFiats(0, 100)
  }
})

const getFiats = (offset: number, limit: number) => {
  fiat.getFiats({
    Offset: offset,
    Limit: limit,
    Message: {}
  }, (error: boolean, rows: Fiat[]) => {
    if (error || rows.length === 0) {
      return
    }
    getFiats(offset + limit, limit)
  })
}

const columns = computed(() => [
  {
    name: 'ID',
    label: t('MSG_ID'),
    field: (row: Fiat) => row.ID
  },
  {
    name: 'Name',
    label: t('MSG_NAME'),
    field: (row: Fiat) => row.Name
  },
  {
    name: 'Unit',
    label: t('MSG_UNIT'),
    field: (row: Fiat) => row.Unit
  },
  {
    name: 'Logo',
    label: t('MSG_LOGO'),
    field: (row: Fiat) => row.Logo
  },
  {
    name: 'CreatedAt',
    label: 'MSG_CREATED_AT',
    field: (row: Fiat) => formatTime(row.CreatedAt)
  },
  {
    name: 'UpdatedAt',
    label: 'MSG_UPDATED_AT',
    field: (row: Fiat) => formatTime(row.UpdatedAt)
  }
])
</script>
