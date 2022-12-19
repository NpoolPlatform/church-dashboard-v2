<template>
  <q-table
    dense
    flat
    :title='$t("MSG_APP_LANGUAGES")'
    :rows='langs'
    row-key='ID'
    :rows-per-page-options='[20]'
    :selected='selectedAppLangs'
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
        <span>{{ $t('MSG_CREATE_APP_LANGUAGE') }}</span>
      </q-card-section>
      <q-card-selection>
        <LanguagePicker v-model:id='target.LangID' />
      </q-card-selection>
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
import { NotifyType } from 'npool-cli-v4'
import { appID } from 'src/api/app'
import { getAppLangs } from 'src/api/g11n'
import { useChurchAppLangStore } from 'src/teststore/g11n/applang'
import { AppLang } from 'src/teststore/g11n/applang/types'
import { computed, defineAsyncComponent, onMounted, ref, watch } from 'vue'

const LoadingButton = defineAsyncComponent(() => import('src/components/button/LoadingButton.vue'))
const LanguagePicker = defineAsyncComponent(() => import('src/components/internationalization/LanguagePicker.vue'))

const lang = useChurchAppLangStore()
const langs = computed(() => lang.getAppLangsByAppID(appID.value))

const selectedAppLangs = ref([] as Array<AppLang>)
const target = ref({} as AppLang)

const showing = ref(false)
const updating = ref(false)

const onCreate = () => {
  showing.value = true
  updating.value = false
}

const onMenuHide = () => {
  showing.value = false
}

const onCancel = () => {
  onMenuHide()
}

const onAuthorize = (done: () => void) => {
  lang.createAppLang({
    TargetAppID: appID.value,
    TargetLangID: target.value?.LangID,
    Main: target.value?.Main,
    Message: {
      Error: {
        Title: 'MSG_CREATE_APP_LANGUAGE',
        Message: 'MSG_CREATE_APP_LANGUAGE_FAIL',
        Popup: true,
        Type: NotifyType.Error
      },
      Info: {
        Title: 'MSG_CREATE_APP_LANGUAGE',
        Message: 'MSG_CREATE_APP_LANGUAGE_SUCCESS',
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
  lang.deleteAppLang({
    ID: selectedAppLangs.value[0]?.ID,
    TargetAppID: selectedAppLangs.value[0]?.AppID,
    Message: {
      Error: {
        Title: 'MSG_DELETE_APP_LANGUAGE',
        Message: 'MSG_DELETE_APP_LANGUAGE_FAIL',
        Popup: true,
        Type: NotifyType.Error
      },
      Info: {
        Title: 'MSG_DELETE_APP_LANGUAGE',
        Message: 'MSG_DELETE_APP_LANGUAGE_SUCCESS',
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
