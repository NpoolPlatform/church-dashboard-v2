<template>
  <q-table
    dense
    flat
    :title='$t("MSG_APP_COUNTRIES")'
    :rows='countries'
    row-key='ID'
    ::rows-per-page-options='[100]'
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
        <CountryPicker v-model:id='countryID' />
      </q-card-section>
      <q-item class='row'>
        <LoadingButton loading :label='$t("MSG_AUTHORIZE")' @click='onAuthorize' />
        <q-btn class='btn round' :label='$t("MSG_CANCEL")' @click='onCancel' />
      </q-item>
    </q-card>
  </q-dialog>
</template>

<script setup lang='ts'>
import { NotifyType, useChurchAppCountryStore, AppCountry } from 'npool-cli-v4'
import { appID } from 'src/api/app'
import { getAppCountries } from 'src/api/g11n'
import { computed, defineAsyncComponent, onMounted, ref, watch } from 'vue'

const LoadingButton = defineAsyncComponent(() => import('src/components/button/LoadingButton.vue'))
const CountryPicker = defineAsyncComponent(() => import('src/components/internationalization/CountryPicker.vue'))

const country = useChurchAppCountryStore()
const countries = computed(() => country.getCountriesByAppID(appID.value))

const selectedCountries = ref([] as Array<AppCountry>)

const countryID = ref('')
const showing = ref(false)

const onCreate = () => {
  showing.value = true
}

const onMenuHide = () => {
  showing.value = false
}

const onCancel = () => {
  onMenuHide()
}

const onAuthorize = (done: () => void) => {
  country.createAppCountry({
    TargetAppID: appID.value,
    CountryID: countryID.value,
    Message: {
      Error: {
        Title: 'MSG_AUTHORIZE_COUNTRY',
        Message: 'MSG_AUTHORIZE_COUNTRY_FAIL',
        Popup: true,
        Type: NotifyType.Error
      },
      Info: {
        Title: 'MSG_AUTHORIZE_COUNTRY',
        Message: 'MSG_AUTHORIZE_COUNTRY_SUCCESS',
        Popup: true,
        Type: NotifyType.Success
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

const onDelete = () => {
  country.deleteAppCountry({
    ID: selectedCountries.value[0].ID,
    TargetAppID: selectedCountries.value[0].AppID,
    Message: {
      Error: {
        Title: 'MSG_DELETE_COUNTRY',
        Message: 'MSG_DELETE_COUNTRY_FAIL',
        Popup: true,
        Type: NotifyType.Error
      },
      Info: {
        Title: 'MSG_DELETE_COUNTRY',
        Message: 'MSG_DELETE_COUNTRY_FAIL',
        Popup: true,
        Type: NotifyType.Success
      }
    }
  }, (error: boolean) => {
    if (error) {
      return
    }
    onMenuHide()
  })
}

watch(appID, () => {
  if (countries.value.length === 0) {
    getAppCountries(0, 100)
  }
})

onMounted(() => {
  if (countries.value.length === 0) {
    getAppCountries(0, 100)
  }
})

</script>
