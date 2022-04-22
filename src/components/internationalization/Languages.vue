<template>
  <q-table
    dense
    flat
    :title='$t("MSG_LANGUAGES")'
    :rows='langs'
    row-key='ID'
    :loading='langLoading'
    :rows-per-page-options='[20]'
    @row-click='(evt, row, index) => onRowClick(row as Language)'
  >
    <template #top-right>
      <div class='row indent flat'>
        <q-btn
          dense
          flat
          class='btn flat'
          :label='$t("MSG_CREATE")'
          @click='onAdd'
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
        <span>{{ $t('MSG_CREATE_LANGUAGE') }}</span>
      </q-card-section>
      <q-card-section>
        <q-input v-model='target.Name' :label='$t("MSG_LANGUAGE_NAME")' />
        <q-input v-model='target.Logo' :label='$t("MSG_LANGUAGE_LOGO")' />
        <q-input v-model='target.Lang' :label='$t("MSG_LANGUAGE_SPEC")' />
        <q-input v-model='target.Short' :label='$t("MSG_LANGUAGE_SHORT")' />
      </q-card-section>
      <q-item class='row'>
        <q-btn class='btn round alt' :label='$t("MSG_SUBMIT")' @click='onSubmit' />
        <q-btn class='btn round' :label='$t("MSG_CANCEL")' @click='onCancel' />
      </q-item>
    </q-card>
  </q-dialog>
</template>

<script setup lang='ts'>
import { Language, NotificationType, useAdminLangStore, useChurchLangStore } from 'npool-cli-v2'
import { computed, onMounted, ref } from 'vue'

const alang = useAdminLangStore()
const langLoading = ref(true)

const clang = useChurchLangStore()
const langs = computed(() => alang.Languages)

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
})

const showing = ref(false)
const updating = ref(false)
const target = ref({} as unknown as Language)

const onMenuHide = () => {
  showing.value = false
  target.value = {} as unknown as Language
}

const onAdd = () => {
  showing.value = true
  updating.value = false
}

const onExport = () => {
  // TODO
}

const onRowClick = (language: Language) => {
  target.value = language
  showing.value = true
  updating.value = true
}

const onSubmit = () => {
  showing.value = false
  if (updating.value) {
    clang.updateLang({
      Info: target.value,
      Message: {
        Error: {
          Title: 'MSG_UPDATE_LANG',
          Message: 'MSG_UPDATE_LANG_FAIL',
          Popup: true,
          Type: NotificationType.Error
        }
      }
    }, () => {
      // TODO
    })
    return
  }

  clang.createLang({
    Info: target.value,
    Message: {
      Error: {
        Title: 'MSG_CREATE_LANG',
        Message: 'MSG_CREATE_LANG_FAIL',
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

</script>
