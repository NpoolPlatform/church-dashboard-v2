<template>
  <q-table
    dense
    flat
    :title='$t("MSG_COUNTRIES")'
    :rows='countries'
    row-key='ID'
    :rows-per-page-options='[100]'
    @row-click='(evt, row, index) => onRowClick(row as country.Country)'
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
import { computed, defineAsyncComponent, onMounted, ref } from 'vue'
import { country, utils, sdk } from 'src/npoolstore'

const LoadingButton = defineAsyncComponent(() => import('src/components/button/LoadingButton.vue'))
const AppCountry = defineAsyncComponent(() => import('src/components/internationalization/AppCountry.vue'))

const countries = sdk.countries

const target = ref({} as country.Country)
const showing = ref(false)
const updating = ref(false)

const onCreate = () => {
  showing.value = true
  updating.value = false
}

const onMenuHide = () => {
  target.value = {} as country.Country
  showing.value = false
}

const onRowClick = (row: country.Country) => {
  target.value = { ...row }
  updating.value = true
  showing.value = true
}

const onCancel = () => {
  onMenuHide()
}

const onSubmit = () => {
  updating.value ? updateCountry() : createCountry()
}

const createCountry = () => {
  sdk.adminCreateCountry(target.value, (error: boolean) => {
    if (error) return
    onMenuHide()
  })
}

const updateCountry = () => {
  sdk.adminUpdateCountry(target.value, (error: boolean) => {
    if (error) return
    onMenuHide()
  })
}

const onExport = () => {
  const blob = new Blob([JSON.stringify(countries.value)], { type: 'text/plain;charset=utf-8' })
  const filename = 'countries-' + utils.formatTime(new Date().getTime() / 1000) + '.json'
  saveAs(blob, filename)
}

const loadedCountries = ref([] as Array<country.Country>)
const loadFileButton = ref<HTMLInputElement>()

const uploadFile = (evt: Event) => {
  const target = evt.target as unknown as HTMLInputElement
  if (target.files) {
    const filename = target.files[0]
    const reader = new FileReader()

    reader.onload = () => {
      loadedCountries.value = JSON.parse(reader.result as string) as Array<country.Country>
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
    } as country.Country
  })
})

const onBatchCreate = () => {
  sdk.adminCreateCountries(importedCountries.value)
}

onMounted(() => {
  if (countries.value.length === 0) {
    sdk.adminGetCountries(0, 0)
  }
})

</script>
