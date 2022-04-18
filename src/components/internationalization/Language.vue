<template>
  <q-table
    dense
    flat
    :title='$t("MSG_LANGUAGES")'
    :rows='langs'
    row-key='ID'
    :loading='langLoading'
    :rows-per-page-options='[20]'
    selection='single'
    v-model:selected='selectedLang'
  />
  <q-table
    dense
    flat
    :title='$t("MSG_APP_LANGUAGES")'
    :rows='appLangs'
    :loading='appLangLoading'
    row-key='ID'
    :rows-per-page-options='[20]'
  >
    <template #top-right>
      <div class='row indent flat'>
        <div v-if='!language' class='column justify-center'>
          <span class='warning'>{{ $t('MSG_SELECT_LANGUAGE') }}</span>
        </div>
        <q-btn
          dense
          flat
          class='btn flat'
          :label='$t("MSG_ADD")'
          @click='onAdd'
        />
      </div>
    </template>
  </q-table>
</template>

<script setup lang='ts'>
import { Language, NotificationType, useAdminLangStore, useChurchLangStore } from 'npool-cli-v2'
import { useLocalApplicationStore } from 'src/localstore'
import { computed, onMounted, ref, watch } from 'vue'

const alang = useAdminLangStore()

const app = useLocalApplicationStore()
const appID = computed(() => app.AppID)

const clang = useChurchLangStore()

const langLoading = ref(true)
const appLangLoading = ref(true)

const langs = computed(() => alang.Languages)
const appLangs = computed(() => clang.Languages.get(appID.value) ? clang.Languages.get(appID.value) : [])
const selectedLang = ref([] as Array<Language>)
const language = computed(() => selectedLang.value.length > 0 ? selectedLang.value[0] : undefined as unknown as Language)

const prepare = () => {
  clang.getLangs({
    TargetAppID: appID.value,
    Message: {
      Error: {
        Title: 'MSG_GET_LANGS',
        Message: 'MSG_GET_LANGS_FAIL',
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, () => {
    appLangLoading.value = false
  })
}

watch(appID, () => {
  prepare()
})

onMounted(() => {
  alang.getLangs({
    Message: {
      Error: {
        Title: 'MSG_GET_LANGS',
        Message: 'MSG_GET_LANGS_FAIL',
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, () => {
    langLoading.value = false
  })

  prepare()
})

const onAdd = () => {
  if (!language.value) {
    return
  }

  clang.createAppLang({
    TargetAppID: appID.value,
    Info: {
      LangID: language.value.ID
    },
    Message: {
      Error: {
        Title: 'MSG_CREATE_APP_LANG',
        Message: 'MSG_CREATE_APP_LANG_FAIL',
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, () => {
    // TODO
  })
}

</script>
