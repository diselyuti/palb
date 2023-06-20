<template>
  <div class="flex flex-col gap-2">
    <h1 class="text-2xl">Documents</h1>
    <nav class="flex flex-1 flex-col" aria-label="Sidebar">
      <ul role="list" class="-mx-2 space-y-1">
        <li v-for="document in documentsByVariantId" :key="document.title">
          <div
            :class="[
              0
                ? 'bg-gray-50 text-indigo-600'
                : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50',
              'group flex w-full justify-between items-center gap-x-3 rounded-md p-2 pl-3 text-sm leading-6 font-semibold'
            ]"
          >
            <a :href="document.file?.download_url" target="_blank">{{ document.title }}</a>
            <XCircleIcon
              @click="deleteDocument(document)"
              class="w-5 h-5 text-gray-400 group-hover:text-gray-500 cursor-pointer"
              aria-hidden="true"
            />
          </div>
        </li>
      </ul>
    </nav>
    <button
      @click="addDocumentPopup = true"
      type="button"
      class="w-full rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
    >
      Add
    </button>
  </div>

  <modal-popup :open="addDocumentPopup" @close="addDocumentPopup = false">
    <template #default>
      <form class="flex flex-col gap-2" @submit.prevent="createNewDocument">
        <label class="block text-sm font-medium leading-6 text-gray-900">
          <span>Title</span>
          <input
            required
            v-model="newDocument.title"
            type="text"
            name="email"
            class="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
        </label>
        <label class="block text-sm font-medium leading-6 text-gray-900">
          <span>File</span>
          <input
            required
            @change="onFileChange"
            type="file"
            class="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
        </label>
        <div class="flex gap-2">
          <button
            @click="addDocumentPopup = false"
            type="button"
            class="w-full rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="w-full rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Add
          </button>
        </div>
      </form>
    </template>
  </modal-popup>
</template>

<script setup lang="ts">
import { XCircleIcon } from '@heroicons/vue/24/outline'
import { onMounted, onUnmounted, ref, watch } from 'vue'
import type IDocument from '@/types/IDocument'
import useDocument from '@/composables/useDocument'
import ModalPopup from '@/components/common/ModalPopup.vue'
import useStorage from '@/composables/useStorage'

const props = defineProps<{
  variantId: string
}>()

const {
  documentsByVariantId,
  subscribeToDocumentsByVariantId,
  unsubscribeFromDocumentsByVariantId,
  deleteDocument,
  createDocument
} = useDocument()

const { uploadFile } = useStorage()

onMounted(() => {
  subscribeToDocumentsByVariantId(props.variantId)
})

onUnmounted(() => {
  unsubscribeFromDocumentsByVariantId()
})

watch(
  () => props.variantId,
  () => {
    unsubscribeFromDocumentsByVariantId()
    subscribeToDocumentsByVariantId(props.variantId)
  }
)

const addDocumentPopup = ref(false)
const newDocument = ref<IDocument>({
  variant_id: props.variantId,
  title: '',
  file: null
})
const documentFile = ref<File | null>(null)
const createNewDocument = async () => {
  addDocumentPopup.value = false
  try {
    newDocument.value.file = await uploadFile(documentFile.value)
    await createDocument({
      ...newDocument.value,
      variant_id: props.variantId
    })
  } catch (e) {
    console.error(e)
  } finally {
    newDocument.value = {
      variant_id: props.variantId,
      title: '',
      file: null
    }
    documentFile.value = null
  }
}
const onFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files) {
    documentFile.value = target.files[0]
  }
}
</script>

<style scoped lang="scss"></style>
