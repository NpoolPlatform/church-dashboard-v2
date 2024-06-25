<template>
  <q-table
    dense
    flat
    :title='$t("MSG_APP_LANGUAGES")'
    :rows='langs'
    row-key='LangID'
    :rows-per-page-options='[100]'
    v-model:selected='selectedAppLangs'
    selection='single'
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
          :label='$t("MSG_DELETE")'
          :disable='selectedAppLangs.length === 0'
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
        {{ $t('MSG_CREATE_APP_LANGUAGE') }}
      </q-card-section>
      <q-card-section>
        <LanguagePicker v-model:id='target.LangID' />
      </q-card-section>
      <q-card-section>
        <div><q-toggle dense v-model='target.Main' :label='$t("MSG_MAIN_LANGUAGE")' /></div>
      </q-card-section>
      <q-item class='row'>
        <q-btn class='btn round' :loading='submitting' :label='$t("MSG_AUTHORIZE")' @click='onAuthorize' />
        <q-btn class='btn alt round' :label='$t("MSG_CANCEL")' @click='onCancel' />
      </q-item>
    </q-card>
  </q-dialog>
</template>

<script setup lang='ts'>
import { defineAsyncComponent, onMounted, ref, watch } from 'vue'
import { g11nbase, sdk } from 'src/npoolstore'

const AppID = sdk.AppID

const LanguagePicker = defineAsyncComponent(() => import('src/components/internationalization/LanguagePicker.vue'))

const langs = sdk.appLanguages

const selectedAppLangs = ref([] as Array<g11nbase.AppLang>)
const target = ref({} as g11nbase.AppLang)

const showing = ref(false)
const updating = ref(false)
const submitting = ref(false)

const onCreate = () => {
  showing.value = true
  updating.value = false
  target.value = { Main: false } as g11nbase.AppLang
}

const onMenuHide = () => {
  showing.value = false
  submitting.value = false
  target.value = {} as g11nbase.AppLang
}

const onCancel = () => {
  onMenuHide()
}

const onAuthorize = () => {
  submitting.value = true
  sdk.adminCreateAppLang(target.value, (error: boolean) => {
    if (error) return
    onMenuHide()
  })
}

const onDelete = () => {
  selectedAppLangs.value.forEach((el) => {
    sdk.adminDeleteAppLang(el)
  })
}

watch(AppID, () => {
  if (langs.value.length === 0) {
    sdk.adminGetAppLangs(0, 0)
  }
})

onMounted(() => {
  if (langs.value.length === 0) {
    sdk.adminGetAppLangs(0, 0)
  }
})
</script>
