<template>
  <q-table
    dense
    flat
    :title='$t("MSG_LANGUAGES")'
    :rows='langs'
    row-key='ID'
    :rows-per-page-options='[20]'
    @row-click='(evt, row, index) => onRowClick(row as Lang)'
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
        <LoadingButton loading :label='$t("MSG_SUBMIT")' @click='onSubmit' />
        <q-btn class='btn round' :label='$t("MSG_CANCEL")' @click='onCancel' />
      </q-item>
    </q-card>
  </q-dialog>

  <!-- AppLanguage -->
  <AppLanguage />
</template>

<script setup lang='ts'>
import { NotifyType, useChurchLangStore, Lang } from 'npool-cli-v4'
import { getLangs } from 'src/api/g11n'
import { computed, defineAsyncComponent, onMounted, ref } from 'vue'

const LoadingButton = defineAsyncComponent(() => import('src/components/button/LoadingButton.vue'))
const AppLanguage = defineAsyncComponent(() => import('src/components/internationalization/AppLanguage.vue'))

const lang = useChurchLangStore()
const langs = computed(() => lang.Langs.Langs)

const target = ref({} as Lang)
const showing = ref(false)
const updating = ref(false)

const onCreate = () => {
  showing.value = true
  updating.value = false
}

const onMenuHide = () => {
  target.value = {} as Lang
  showing.value = false
}

const onRowClick = (row: Lang) => {
  target.value = { ...row }
  updating.value = true
  showing.value = true
}

const onCancel = () => {
  onMenuHide()
}

const onSubmit = (done: () => void) => {
  updating.value ? updateLang(done) : createLang(done)
}

const createLang = (done: () => void) => {
  lang.createLang({
    ...target.value,
    Message: {
      Error: {
        Title: 'MSG_CREATE_LANGUAGE',
        Message: 'MSG_CREATE_LANGUAGE_FAIL',
        Popup: true,
        Type: NotifyType.Error
      },
      Info: {
        Title: 'MSG_CREATE_LANGUAGE',
        Message: 'MSG_CREATE_LANGUAGE_SUCCESS',
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
    ID: target.value?.ID,
    Lang: target.value?.Lang,
    Logo: target.value?.Logo,
    Name: target.value?.Name,
    Short: target.value?.Short
  }
})

const updateLang = (done: () => void) => {
  lang.updateLang({
    ...updateTarget.value,
    Message: {
      Error: {
        Title: 'MSG_UPDATE_LANGUAGE',
        Message: 'MSG_UPDATE_LANGUAGE_FAIL',
        Popup: true,
        Type: NotifyType.Error
      },
      Info: {
        Title: 'MSG_UPDATE_LANGUAGE',
        Message: 'MSG_UPDATE_LANGUAGE_SUCCESS',
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

onMounted(() => {
  if (langs.value.length === 0) {
    getLangs(0, 100)
  }
})
</script>
