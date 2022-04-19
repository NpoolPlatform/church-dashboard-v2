<template>
  <q-table
    dense
    flat
    :title='$t("MSG_COUNTRIES")'
    :rows='countries'
    row-key='ID'
    :loading='countryLoading'
    :rows-per-page-options='[10]'
    @row-click='(evt, row, index) => onRowClick(row as Country)'
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
        <q-btn
          dense
          flat
          class='btn flat'
          :label='$t("MSG_EXPORT")'
          @click='onExport'
        />
      </div>
    </template>
  </q-table>
  <q-table
    dense
    flat
    :title='$t("MSG_LOADED_COUNTRIES")'
    :rows='loadedCountries'
    row-key='ID'
    :rows-per-page-options='[10]'
  >
    <template #top-right>
      <div class='row indent flat'>
        <input
          ref='loadFileButton'
          type='file'
          style='display: none;'
          @change='onFileLoaded'
          accept='.json'
        >
        <q-btn
          dense
          flat
          class='btn flat'
          :label='$t("MSG_LOAD_FILE")'
          @click='onLoadFile'
        />
        <q-btn
          dense
          flat
          class='btn flat'
          :label='$t("MSG_SUBMIT")'
          @click='onSubmitLoaded'
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
        <span>{{ $t('MSG_CREATE_COUNTRY') }}</span>
      </q-card-section>
      <q-card-section>
        <q-input v-model='target.Country' :label='$t("MSG_COUNTRY")' />
        <q-input v-model='target.Flag' :label='$t("MSG_FLAG")' />
        <q-input v-model='target.Code' :label='$t("MSG_COUNTRY_CODE")' />
        <q-input v-model='target.Short' :label='$t("MSG_COUNTRY_SHORT")' />
      </q-card-section>
      <q-item class='row'>
        <q-btn class='btn round alt' :label='$t("MSG_SUBMIT")' @click='onSubmit' />
        <q-btn class='btn round' :label='$t("MSG_CANCEL")' @click='onCancel' />
      </q-item>
    </q-card>
  </q-dialog>
</template>

<script setup lang='ts'>
import { saveAs } from 'file-saver'
import {
  NotificationType,
  useLangStore,
  Country,
  useChurchLangStore,
  formatTime
} from 'npool-cli-v2'
import { computed, onMounted, ref } from 'vue'

const lang = useLangStore()
const countries = computed(() => lang.Countries)
const countryLoading = ref(true)

const loadedCountries = ref([] as Array<Country>)

const churchLang = useChurchLangStore()

const showing = ref(false)
const updating = ref(false)
const target = ref({} as unknown as Country)

onMounted(() => {
  lang.getCountries({
    Message: {
      Error: {
        Title: 'MSG_GET_COUNTRIES',
        Message: 'MSG_GET_COUNTRIES_FAIL',
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, () => {
    countryLoading.value = false
  })
})

const onMenuHide = () => {
  showing.value = false
  target.value = {} as unknown as Country
}

const onRowClick = (country: Country) => {
  target.value = country
  showing.value = true
  updating.value = true
}

const onCreate = () => {
  showing.value = true
  updating.value = false
}

const onSubmit = () => {
  showing.value = false

  if (updating.value) {
    churchLang.updateCountry({
      Info: target.value,
      Message: {
        Error: {
          Title: 'MSG_CREATE_COUNTRY',
          Message: 'MSG_CREATE_COUNTRY_FAIL',
          Popup: true,
          Type: NotificationType.Error
        }
      }
    }, () => {
      // TODO
    })
    return
  }

  churchLang.createCountry({
    Info: target.value,
    Message: {
      Error: {
        Title: 'MSG_CREATE_COUNTRY',
        Message: 'MSG_CREATE_COUNTRY_FAIL',
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

const onExport = () => {
  const blob = new Blob([JSON.stringify({
    countries
  })], { type: 'text/plain;charset=utf-8' })
  const filename = 'countries-' +
                   formatTime(new Date().getTime() / 1000) +
                   '.json'
  saveAs(blob, filename)
}

const loadFileButton = ref<HTMLInputElement>()
const onLoadFile = () => {
  loadFileButton.value?.click()
}

const onFileLoaded = (evt: Event) => {
  const target = evt.target as unknown as HTMLInputElement
  if (target.files) {
    const filename = target.files[0]
    const reader = new FileReader()
    reader.onload = () => {
      loadedCountries.value = JSON.parse(reader.result as string) as Array<Country>
    }
    reader.readAsText(filename)
  }
}

const onSubmitLoaded = () => {
  churchLang.createCountries({
    Infos: loadedCountries.value,
    Message: {
      Error: {
        Title: 'MSG_CREATE_COUNTRIES',
        Message: 'MSG_CREATE_COUNTRIES_FAIL',
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, () => {
    // TODO
  })
}

</script>
