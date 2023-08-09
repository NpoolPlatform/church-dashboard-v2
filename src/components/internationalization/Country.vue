<template>
  <q-table
    dense
    flat
    :title='$t("MSG_COUNTRIES")'
    :rows='countries'
    row-key='ID'
    :rows-per-page-options='[100]'
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
        <LoadingButton loading :label='$t("MSG_SUBMIT")' @click='onSubmit' />
        <q-btn class='btn round' :label='$t("MSG_CANCEL")' @click='onCancel' />
      </q-item>
    </q-card>
  </q-dialog>
  <AppCountry />
  <q-table
    dense
    flat
    :title='$t("MSG_LOADED_COUNTRIES")'
    row-key='ID'
    :rows='loadedCountries'
    :rows-per-page-options='[100]'
  >
    <template #top-right>
      <div class='row indent flat'>
        <input
          ref='loadFileButton'
          type='file'
          style='display: none;'
          @change='uploadFile'
          accept='.json'
        >
        <q-btn
          dense
          flat
          class='btn flat'
          :label='$t("MSG_IMPORT")'
          @click='loadFileButton?.click()'
        />
        <q-btn
          dense
          flat
          class='btn flat'
          :label='$t("MSG_BATCH_CREATE")'
          :disable='loadedCountries.length === 0'
          @click='onBatchCreate'
        />
      </div>
    </template>
  </q-table>
</template>

<script setup lang='ts'>
import { saveAs } from 'file-saver'
import { NotifyType, formatTime, useChurchCountryStore, Country } from 'npool-cli-v4'
import { getCountries } from 'src/api/g11n'
import { computed, defineAsyncComponent, onMounted, ref } from 'vue'
import AppCountry from './AppCountry.vue'

const LoadingButton = defineAsyncComponent(() => import('src/components/button/LoadingButton.vue'))

const country = useChurchCountryStore()
const countries = computed(() => country.Countries.Countries)

const target = ref({} as Country)
const showing = ref(false)
const updating = ref(false)

const onCreate = () => {
  showing.value = true
  updating.value = false
}

const onMenuHide = () => {
  target.value = {} as Country
  showing.value = false
}

const onRowClick = (row: Country) => {
  target.value = { ...row }
  updating.value = true
  showing.value = true
}

const onCancel = () => {
  onMenuHide()
}

const onSubmit = (done: () => void) => {
  updating.value ? updateCountry(done) : createCountry(done)
}

const createCountry = (done: () => void) => {
  country.createCountry({
    ...target.value,
    Message: {
      Error: {
        Title: 'MSG_CREATE_COUNTRY',
        Message: 'MSG_CREATE_COUNTRY_FAIL',
        Popup: true,
        Type: NotifyType.Error
      },
      Info: {
        Title: 'MSG_CREATE_COUNTRY',
        Message: 'MSG_CREATE_COUNTRY_SUCCESS',
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

const updateTarget = computed(() => {
  return {
    ID: target?.value?.ID,
    Country: target?.value?.Country,
    Flag: target?.value?.Flag,
    Short: target?.value?.Short,
    Code: target?.value?.Code
  }
})
const updateCountry = (done: () => void) => {
  country.updateCountry({
    ...updateTarget.value,
    Message: {
      Error: {
        Title: 'MSG_UPDATE_COUNTRY',
        Message: 'MSG_UPDATE_COUNTRY_FAIL',
        Popup: true,
        Type: NotifyType.Error
      },
      Info: {
        Title: 'MSG_UPDATE_COUNTRY',
        Message: 'MSG_UPDATE_COUNTRY_FAIL',
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

const onExport = () => {
  const blob = new Blob([JSON.stringify(countries.value)], { type: 'text/plain;charset=utf-8' })
  const filename = 'countries-' + formatTime(new Date().getTime() / 1000) + '.json'
  saveAs(blob, filename)
}

const loadedCountries = ref([] as Array<Country>)
const loadFileButton = ref<HTMLInputElement>()

const uploadFile = (evt: Event) => {
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

const importedCountries = computed(() => {
  return Array.from(loadedCountries.value).map((el) => {
    return {
      Country: el.Country,
      Code: el.Code,
      Short: el.Short,
      Flag: el.Flag
    } as Country
  })
})

const onBatchCreate = () => {
  country.createCountries({
    Infos: importedCountries.value,
    Message: {
      Error: {
        Title: 'MSG_CREATE_COUNTRIES',
        Message: 'MSG_CREATE_COUNTRIES_FAIL',
        Popup: true,
        Type: NotifyType.Error
      },
      Info: {
        Title: 'MSG_BATCH_CREATE_COUNTRIES',
        Message: 'MSG_BATCH_CREATE_COUNTRIES_SUCCESS',
        Popup: true,
        Type: NotifyType.Success
      }
    }
  }, () => {
    // TODO
  })
}

onMounted(() => {
  if (countries.value.length === 0) {
    getCountries(0, 100)
  }
})

</script>
