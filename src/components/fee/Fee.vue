<template>
  <q-table
    dense
    flat
    :title='$t("MSG_FEES")'
    :rows='fees'
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
        <q-select :options='feetypes' v-model='feetype' :label='$t("MSG_FEE_TYPE")' />
        <span>{{ $t('MSG_PAY_TYPE') }}: {{ feetype?.value.PayType }}</span>
      </q-card-section>
      <q-card-section>
        <q-input type='number' v-model='target.Value' :label='$t("MSG_PAY_AMOUNT")' />
      </q-card-section>
      <q-item class='row'>
        <q-btn class='btn round alt' :label='$t("MSG_SUBMIT")' @click='onSubmit' />
        <q-btn class='btn round' :label='$t("MSG_CANCEL")' @click='onCancel' />
      </q-item>
    </q-card>
  </q-dialog>
</template>

<script setup lang='ts'>
import { useFeeStore, useGoodStore, NotificationType, Fee, FeeType } from 'npool-cli-v2'
import { computed, onMounted, ref } from 'vue'

const good = useGoodStore()
const fee = useFeeStore()

interface MyFeeType {
  label: string
  value: FeeType
}

const feetypes = computed(() => Array.from(good.FeeTypes).map((el) => {
  return {
    label: el.FeeType,
    value: el
  } as MyFeeType
}))
const feetype = ref(undefined as unknown as MyFeeType)
const fees = computed(() => fee.Fees)

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

  fee.getFees({
    Message: {
      Error: {
        Title: 'MSG_GET_FEES',
        Message: 'MSG_GET_FEES_FAIL',
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, () => {
    // TODO
  })
})

const showing = ref(false)
const target = ref({} as unknown as Fee)

const onCreate = () => {
  showing.value = true
}

const onMenuHide = () => {
  target.value = {} as unknown as Fee
  showing.value = false
}

const onSubmit = () => {
  showing.value = false

  if (!feetype.value) {
    return
  }

  fee.createFee({
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
