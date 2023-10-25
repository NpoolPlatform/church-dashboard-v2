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
        <LoadingButton loading :label='$t("MSG_AUTHORIZE")' @click='onAuthorize' />
        <q-btn class='btn round' :label='$t("MSG_CANCEL")' @click='onCancel' />
      </q-item>
    </q-card>
  </q-dialog>
</template>

<script setup lang='ts'>
import { AppID } from 'src/api/app'
import { getAppLangs } from 'src/api/g11n'
import { computed, defineAsyncComponent, onMounted, ref, watch } from 'vue'
import { applang, notify, g11nbase } from 'src/npoolstore'

const LoadingButton = defineAsyncComponent(() => import('src/components/button/LoadingButton.vue'))
const LanguagePicker = defineAsyncComponent(() => import('src/components/internationalization/LanguagePicker.vue'))

const lang = applang.useAppLangStore()
const langs = computed(() => lang.langs(AppID.value))

const selectedAppLangs = ref([] as Array<g11nbase.AppLang>)
const target = ref({} as g11nbase.AppLang)

const showing = ref(false)
const updating = ref(false)

const onCreate = () => {
  showing.value = true
  updating.value = false
  target.value = { Main: false } as g11nbase.AppLang
}

const onMenuHide = () => {
  showing.value = false
  target.value = {} as g11nbase.AppLang
}

const onCancel = () => {
  onMenuHide()
}

const onAuthorize = (done: () => void) => {
  lang.createAppLang({
    TargetAppID: AppID.value,
    TargetLangID: target.value?.LangID,
    Main: target.value?.Main,
    Message: {
      Error: {
        Title: 'MSG_CREATE_APP_LANGUAGE',
        Message: 'MSG_CREATE_APP_LANGUAGE_FAIL',
        Popup: true,
        Type: notify.NotifyType.Error
      },
      Info: {
        Title: 'MSG_CREATE_APP_LANGUAGE',
        Message: 'MSG_CREATE_APP_LANGUAGE_SUCCESS',
        Popup: true,
        Type: notify.NotifyType.Success
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
  lang.deleteAppLang({
    ID: selectedAppLangs.value[0]?.ID,
    TargetAppID: selectedAppLangs.value[0]?.AppID,
    Message: {
      Error: {
        Title: 'MSG_DELETE_APP_LANGUAGE',
        Message: 'MSG_DELETE_APP_LANGUAGE_FAIL',
        Popup: true,
        Type: notify.NotifyType.Error
      },
      Info: {
        Title: 'MSG_DELETE_APP_LANGUAGE',
        Message: 'MSG_DELETE_APP_LANGUAGE_SUCCESS',
        Popup: true,
        Type: notify.NotifyType.Success
      }
    }
  }, (error: boolean) => {
    if (error) {
      return
    }
    onMenuHide()
  })
}

watch(AppID, () => {
  if (langs.value.length === 0) {
    getAppLangs(0, 100)
  }
})

onMounted(() => {
  if (langs.value.length === 0) {
    getAppLangs(0, 100)
  }
})
</script>
