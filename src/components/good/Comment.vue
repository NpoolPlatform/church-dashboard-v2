<template>
  <q-table
    dense
    flat
    :title='$t("MSG_APP_GOOD_COMMENTS")'
    :rows='comments'
    row-key='ID'
    :rows-per-page-options='[100]'
    @row-click='(evt, row, index) => onRowClick(row as appgoodcomment.Comment)'
    selection='single'
    v-model:selected='selectedComments'
  >
    <template #top-right>
      <div class='row indent flat'>
        <q-btn
          dense
          flat
          class='btn flat'
          :label='$t("MSG_DELETE")'
          @click='onDelete'
          :disable='selectedComment === undefined'
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
        <span>{{ $t('MSG_UPDATE_COMMENT') }}</span>
      </q-card-section>
      <q-card-section>
        <span> {{ target.GoodName }}</span>
      </q-card-section>
      <q-card-section>
        <span>{{ target.Content }}</span>
      </q-card-section>
      <q-card-section>
        <q-toggle v-model='target.Hide' :label='$t("MSG_HIDE")' />
        <q-select :disable='!target.Hide' :options='goodbase.GoodCommentHideReasons' v-model='target.HideReason' />
      </q-card-section>
      <q-item class='row'>
        <q-btn class='btn round' :loading='submitting' :label='$t("MSG_SUBMIT")' @click='onSubmit' />
        <q-btn class='btn alt round' :label='$t("MSG_CANCEL")' @click='onCancel' />
      </q-item>
    </q-card>
  </q-dialog>
</template>

<script setup lang='ts'>
import { computed, onMounted, ref, watch } from 'vue'
import { sdk, appgoodcomment, goodbase } from 'src/npoolstore'

const AppID = sdk.AppID
const comments = sdk.goodComments

const showing = ref(false)
const submitting = ref(false)
const target = ref(undefined as unknown as appgoodcomment.Comment)
const selectedComments = ref([] as appgoodcomment.Comment[])
const selectedComment = computed(() => selectedComments.value[0])

const onRowClick = (row: appgoodcomment.Comment) => {
  target.value = row
  showing.value = true
}

const onCancel = () => {
  onMenuHide()
}

const onMenuHide = () => {
  showing.value = false
}

const onSubmit = () => {
  sdk.adminUpdateGoodComment(target.value, () => {
    showing.value = false
  })
}

const onDelete = () => {
  sdk.adminDeleteGoodComment(selectedComment.value, () => {
    selectedComments.value = []
  })
}

watch(AppID, () => {
  prepare()
})

onMounted(() => {
  prepare()
})

const prepare = () => {
  if (comments.value.length === 0) {
    sdk.adminGetGoodComments(0, 0)
  }
}
</script>
