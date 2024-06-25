<template>
  <q-table
    dense
    flat
    :title='$t("MSG_APP_COUNTRIES")'
    :rows='countries'
    row-key='ID'
    :rows-per-page-options='[100]'
    v-model:selected='selectedCountries'
    selection='single'
  >
    <template #top-right>
      <div class='row indent flat'>
        <q-btn
          dense
          flat
          class='btn flat'
          :label='$t("MSG_AUTHORIZE")'
          @click='onCreate'
        />
        <q-btn
          class='dense flat btn'
          dense
          flat
          :label='$t("MSG_DELETE")'
          :disable='selectedCountries.length === 0'
          @click='onDelete'
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
        <span>{{ $t('MSG_AUTHORIZE_COUNTRY') }}</span>
      </q-card-section>
      <q-card-section>
        <CountryPicker v-model:id='target.CountryID' />
      </q-card-section>
      <q-item class='row'>
        <q-btn loading :label='$t("MSG_AUTHORIZE")' @click='onAuthorize' />
        <q-btn class='btn round' :label='$t("MSG_CANCEL")' @click='onCancel' />
      </q-item>
    </q-card>
  </q-dialog>
</template>

<script setup lang='ts'>
import { defineAsyncComponent, onMounted, ref, watch } from 'vue'
import { appcountry, sdk } from 'src/npoolstore'

const AppID = sdk.AppID

const CountryPicker = defineAsyncComponent(() => import('src/components/internationalization/CountryPicker.vue'))

const countries = sdk.appCountries

const selectedCountries = ref([] as Array<appcountry.Country>)

const target = ref({} as appcountry.Country)
const showing = ref(false)

const onCreate = () => {
  showing.value = true
  target.value = {} as appcountry.Country
}

const onMenuHide = () => {
  showing.value = false
}

const onCancel = () => {
  onMenuHide()
}

const onAuthorize = () => {
  sdk.adminCreateAppCountry(target.value, (error: boolean) => {
    if (error) return
    onMenuHide()
  })
}

const onDelete = () => {
  selectedCountries.value.forEach((el) => {
    sdk.adminDeleteAppCountry(el)
  })
}

watch(AppID, () => {
  if (!countries.value.length) {
    sdk.adminGetAppCountries(0, 0)
  }
})

onMounted(() => {
  if (!countries.value.length) {
    sdk.adminGetAppCountries(0, 0)
  }
})

</script>
