<template>
  <q-table
    dense
    flat
    :title='$t("MSG_FEE_TYPES")'
    :rows='feetypes'
    @row-click='(evt, row, index) => onRowClick(row as FeeType)'
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
        <span>{{ $t('MSG_CREATE_FEE_TYPE') }}</span>
      </q-card-section>
      <q-card-section>
        <q-select :options='FeePayTypes' v-model='target.PayType' :label='$t("MSG_PAY_TYPE")' />
      </q-card-section>
      <q-card-section>
        <q-input v-model='target.FeeType' :label='$t("MSG_FEE_TYPE")' />
        <q-input v-model='target.FeeDescription' :label='$t("MSG_FEE_DESCRIPTION")' />
      </q-card-section>
      <q-item class='row'>
        <q-btn class='btn round alt' :label='$t("MSG_SUBMIT")' @click='onSubmit' />
        <q-btn class='btn round' :label='$t("MSG_CANCEL")' @click='onCancel' />
      </q-item>
    </q-card>
  </q-dialog>
</template>

<script setup lang='ts'>
import { useFeeStore, useGoodStore, NotificationType, FeeType, FeePayTypes } from 'npool-cli-v2'
import { computed, onMounted, ref } from 'vue'

const good = useGoodStore()
const fee = useFeeStore()
const feetypes = computed(() => good.FeeTypes)

onMounted(() => {
  good.getFeeTypes({
    Message: {
      Error: {
        Title: 'MSG_GET_FEE_TYPES',
        Message: 'MSG_GET_FEE_TYPES_FAIL',
        Popup: true,
        Type: NotificationType.Error
      }
    }
  })
})

const showing = ref(false)
const updating = ref(false)
const target = ref({} as unknown as FeeType)

const onCreate = () => {
  showing.value = true
  updating.value = false
}

const onRowClick = (feeType: FeeType) => {
  target.value = feeType
  showing.value = true
  updating.value = true
}

const onMenuHide = () => {
  target.value = {} as unknown as FeeType
  showing.value = false
}

const onSubmit = () => {
  showing.value = false

  if (updating.value) {
    fee.updateFeeType({
      Info: target.value,
      Message: {
        Error: {
          Title: 'MSG_UPDATE_FEE_TYPE',
          Message: 'MSG_UPDATE_FEE_TYPE_FAIL',
          Popup: true,
          Type: NotificationType.Error
        }
      }
    }, () => {
      // TODO
    })
    return
  }

  fee.createFeeType({
    Info: target.value,
    Message: {
      Error: {
        Title: 'MSG_CREATE_FEE_TYPE',
        Message: 'MSG_CREATE_FEE_TYPE_FAIL',
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

</script>
