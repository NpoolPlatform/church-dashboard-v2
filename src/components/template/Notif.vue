<template>
  <q-table
    dense
    flat
    :title='$t("MSG_FRONTEND_TEMPLATES")'
    :rows='frontendTemplates'
    row-key='ID'
    ::rows-per-page-options='[100]'
    :columns='columns'
    @row-click='(evt, row, index) => onRowClick(row as FrontendTemplate)'
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
        <span>{{ $t('MSG_FRONTEND_TEMPLATE') }}</span>
      </q-card-section>
      <q-card-section>
        <q-input v-model='target.Title' :label='$t("MSG_TITLE")' />
        <q-select :options='EventTypes' v-model='target.UsedFor' :disable='updating' :label='$t("MSG_EVENT_TYPES")' />
        <LanguagePicker v-model:language='target.LangID' :updating='updating' />
      </q-card-section>
      <q-card-section>
        <q-input v-model='target.Content' :label='$t("MSG_CONTENT")' type='textarea' />
      </q-card-section>
      <q-item class='row'>
        <LoadingButton :loading='true' :label='$t("MSG_SUBMIT")' @click='onSubmit' />
        <q-btn class='btn round' :label='$t("MSG_CANCEL")' @click='onCancel' />
      </q-item>
    </q-card>
  </q-dialog>
</template>

<script setup lang='ts'>
import { computed, onMounted, ref, defineAsyncComponent, watch } from 'vue'
import { formatTime, NotifyType, useChurchFrontendTemplateStore, EventTypes, FrontendTemplate } from 'npool-cli-v4'
import { appID } from 'src/api/app'
import { useI18n } from 'vue-i18n'
// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const LoadingButton = defineAsyncComponent(() => import('src/components/button/LoadingButton.vue'))
const LanguagePicker = defineAsyncComponent(() => import('src/components/lang/LanguagePicker.vue'))

const notif = useChurchFrontendTemplateStore()
const frontendTemplates = computed(() => notif.getFrontendTemplatesByAppID(appID.value).sort((a, b) => a.UsedFor.localeCompare(b.UsedFor, 'zh-CN')))

const showing = ref(false)
const updating = ref(false)

const target = ref({} as FrontendTemplate)

const onMenuHide = () => {
  target.value = {} as FrontendTemplate
}

const onRowClick = (template: FrontendTemplate) => {
  target.value = { ...template }
  showing.value = true
  updating.value = true
}

const onCreate = () => {
  showing.value = true
  updating.value = false
}

const onCancel = () => {
  showing.value = false
  onMenuHide()
}

const onSubmit = (done: () => void) => {
  updating.value ? updateAppFrontendTemplate(done) : createAppFrontendTemplate(done)
}

watch(appID, () => {
  if (frontendTemplates.value?.length === 0) {
    getAppFrontendTemplate(0, 500)
  }
})

onMounted(() => {
  if (frontendTemplates.value?.length === 0) {
    getAppFrontendTemplate(0, 500)
  }
})

const getAppFrontendTemplate = (offset: number, limit: number) => {
  notif.getAppFrontendTemplates({
    TargetAppID: appID.value,
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: 'MSG_GET_FRONTEND_TEMPLATES',
        Message: 'MSG_GET_FRONTEND_TEMPLATES_FAIL',
        Popup: true,
        Type: NotifyType.Error
      }
    }
  }, (error: boolean, rows: Array<FrontendTemplate>) => {
    if (error || rows.length < limit) {
      return
    }
    getAppFrontendTemplate(offset + limit, limit)
  })
}

const createAppFrontendTemplate = (done: () => void) => {
  notif.createAppFrontendTemplate({
    ...target.value,
    TargetAppID: appID.value,
    TargetLangID: target.value.LangID,
    Message: {
      Error: {
        Title: 'MSG_CREATE_FRONTEND_TEMPLATE',
        Message: 'MSG_CREATE_FRONTEND_TEMPLATE_FAIL',
        Popup: true,
        Type: NotifyType.Error
      },
      Info: {
        Title: 'MSG_CREATE_FRONTEND_TEMPLATE',
        Message: 'MSG_CREATE_FRONTEND_TEMPLATE_SUCCESS',
        Popup: true,
        Type: NotifyType.Success
      }
    }
  }, (error: boolean) => {
    done()
    if (!error) {
      onCancel()
    }
  })
}
const updateAppFrontendTemplate = (done: () => void) => {
  notif.updateAppFrontendTemplate({
    ...target.value,
    TargetAppID: target.value?.AppID,
    TargetLangID: target.value.LangID,
    Message: {
      Error: {
        Title: 'MSG_UPDATE_FRONTEND_TEMPLATE',
        Message: 'MSG_UPDATE_FRONTEND_TEMPLATE_FAIL',
        Popup: true,
        Type: NotifyType.Error
      },
      Info: {
        Title: 'MSG_UPDATE_FRONTEND_TEMPLATE',
        Message: 'MSG_UPDATE_FRONTEND_TEMPLATE_SUCCESS',
        Popup: true,
        Type: NotifyType.Success
      }
    }
  }, (error: boolean) => {
    done()
    if (!error) {
      onCancel()
    }
  })
}

const columns = computed(() => [
  {
    name: 'ID',
    label: t('MSG_ID'),
    field: (row: FrontendTemplate) => row.ID
  },
  {
    name: 'AppID',
    label: t('MSG_APP_ID'),
    field: (row: FrontendTemplate) => row.AppID
  },
  {
    name: 'LangID',
    label: t('MSG_LANG_ID'),
    field: (row: FrontendTemplate) => row.LangID
  },
  {
    name: 'Title',
    label: t('MSG_TITLE'),
    field: (row: FrontendTemplate) => row.Title
  },
  {
    name: 'Content',
    label: t('MSG_CONTENT'),
    field: (row: FrontendTemplate) => row.Content
  },
  {
    name: 'UsedFor',
    label: t('MSG_USED_FOR'),
    field: (row: FrontendTemplate) => row.UsedFor
  },
  {
    name: 'CreatedAt',
    label: t('MSG_CREATED_AT'),
    field: (row: FrontendTemplate) => formatTime(row.CreatedAt)
  },
  {
    name: 'UpdatedAt',
    label: t('MSG_UPDATED_AT'),
    field: (row: FrontendTemplate) => formatTime(row.UpdatedAt)
  }
])
</script>
