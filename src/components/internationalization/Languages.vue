<template>
  <q-table
    dense
    flat
    :title='$t("MSG_LANGUAGES")'
    :rows='langs'
    row-key='ID'
    :rows-per-page-options='[100]'
    @row-click='(evt, row, index) => onRowClick(row as language.Lang)'
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
        <!-- <q-btn
          dense
          flat
          class='btn flat'
          :label='$t("MSG_EXPORT")'
          @click='onExport'
        /> -->
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
        <span>{{ updating? $t('MSG_UPDATE_LANGUAGE') : $t('MSG_CREATE_LANGUAGE') }}</span>
      </q-card-section>
      <q-card-section>
        <q-input v-model='target.Name' :label='$t("MSG_LANGUAGE_NAME")' />
        <q-input v-model='target.Logo' :label='$t("MSG_LANGUAGE_LOGO")' />
        <q-input v-model='target.Lang' :label='$t("MSG_LANGUAGE_LANG")' />
        <q-input v-model='target.Short' :label='$t("MSG_LANGUAGE_SHORT")' />
      </q-card-section>
      <q-item class='row'>
        <q-btn loading :label='$t("MSG_SUBMIT")' @click='onSubmit' />
        <q-btn class='btn round' :label='$t("MSG_CANCEL")' @click='onCancel' />
      </q-item>
    </q-card>
  </q-dialog>

  <!-- AppLanguage -->
  <AppLanguage />
</template>

<script setup lang='ts'>
import { defineAsyncComponent, onMounted, ref } from 'vue'
import { language, sdk } from 'src/npoolstore'

const AppLanguage = defineAsyncComponent(() => import('src/components/internationalization/AppLanguage.vue'))

const langs = sdk.languages

const target = ref({} as language.Lang)
const showing = ref(false)
const updating = ref(false)

const onCreate = () => {
  showing.value = true
  updating.value = false
}

const onMenuHide = () => {
  target.value = {} as language.Lang
  showing.value = false
}

const onRowClick = (row: language.Lang) => {
  target.value = { ...row }
  updating.value = true
  showing.value = true
}

const onCancel = () => {
  onMenuHide()
}

const onSubmit = () => {
  updating.value ? updateLang() : createLang()
}

const createLang = () => {
  sdk.adminCreateLang(target.value, (error: boolean) => {
    if (error) return
    onMenuHide()
  })
}

const updateLang = () => {
  sdk.adminUpdateLang(target.value, (error: boolean) => {
    if (error) return
    onMenuHide()
  })
}

onMounted(() => {
  if (langs.value.length === 0) {
    sdk.adminGetLangs(0, 0)
  }
})
</script>
