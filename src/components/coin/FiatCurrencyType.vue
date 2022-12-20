<template>
  <q-table
    dense
    flat
    :rows='displayTypes'
    row-key='ID'
    :title='$t("MSG_FIAT_CURRENCY_TYPES")'
    :rows-per-page-options='[10]'
    @row-click='(evt, row, index) => onRowClick(row as FiatCurrencyType)'
  >
    <template #top-right>
      <div class='row indent flat'>
        <q-input
          dense
          flat
          class='small'
          v-model='name'
          :label='$t("MSG_TYPE")'
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
        <q-input v-model='target.Name' :label='$t("MSG_FIAT_CURRENCY_NAME")' />
        <q-input v-model='target.Logo' :label='$t("MSG_FIAT_LOGO")' />
      </q-card-section>
      <q-item class='row'>
        <LoadingButton loading :label='$t("MSG_SUBMIT")' @click='onSubmit' />
        <q-btn class='btn round' :label='$t("MSG_CANCEL")' @click='onCancel' />
      </q-item>
    </q-card>
  </q-dialog>
</template>

<script setup lang='ts'>
import { NotifyType } from 'npool-cli-v4'
import { getFiatCurrencyTypes } from 'src/api/fiat'
import { useChurchFiatCurrencyStore } from 'src/teststore/fiat-currency'
import { FiatCurrencyType } from 'src/teststore/fiat-currency/types'
import { computed, onMounted, ref, defineAsyncComponent } from 'vue'

const LoadingButton = defineAsyncComponent(() => import('src/components/button/LoadingButton.vue'))

const fiat = useChurchFiatCurrencyStore()
const types = computed(() => fiat.FiatCurrencyTypes.FiatCurrencyTypes)

const name = ref('')
const displayTypes = computed(() => {
  return types.value.filter((el) => el.Name?.toLowerCase()?.includes?.(name.value?.toLowerCase()) || el.ID?.toLowerCase()?.includes(name.value?.toLowerCase()))
})

const showing = ref(false)
const updating = ref(false)
const target = ref({} as FiatCurrencyType)

const onCreate = () => {
  showing.value = true
  updating.value = false
}

const onRowClick = (row: FiatCurrencyType) => {
  target.value = { ...row }
  showing.value = true
  updating.value = true
}

const onCancel = () => {
  onMenuHide()
}

const onMenuHide = () => {
  showing.value = false
  target.value = {} as FiatCurrencyType
}

const onSubmit = (done: () => void) => {
  updating.value ? updateFiatCurrencyType(done) : createFiatCurrencyType(done)
}

const createFiatCurrencyType = (done: () => void) => {
  fiat.createFiatCurrencyType({
    ...target.value,
    Message: {
      Error: {
        Title: 'MSG_CREATE_FIAT_CURRENCY_TYPE',
        Message: 'MSG_CREATE_FIAT_CURRENCY_TYPE_FAIL',
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
const updateTarget = computed(() => {
  return {
    ID: target.value.ID,
    Name: target.value.Name,
    Logo: target.value.Logo
  }
})

const updateFiatCurrencyType = (done: () => void) => {
  fiat.updateFiatCurrencyType({
    ...updateTarget.value,
    Message: {
      Error: {
        Title: 'MSG_UPDATE_FIAT_CURRENCY_TYPE',
        Message: 'MSG_UPDATE_FIAT_CURRENCY_TYPE_FAIL',
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
  if (fiat.FiatCurrencyTypes.FiatCurrencyTypes.length === 0) {
    getFiatCurrencyTypes(0, 100)
  }
})
</script>
