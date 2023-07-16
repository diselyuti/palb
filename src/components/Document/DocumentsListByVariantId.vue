<template>
  <div class="flex flex-col gap-2 h-full">
    <div class="flex justify-between items center">
      <h1 class="text-2xl">Документи</h1>
      <div class="flex items-center gap-2">
        <ArrowPathIcon
          v-show="loadingDocuments"
          class="w-5 h-5 text-gray-500 animate-spin"
          aria-hidden="true"
        />
        <is-access-to-add>
          <button @click="addDocumentPopup = true" type="button">
            <PlusCircleIcon class="w-5 h-5 text-gray-500" aria-hidden="true" />
          </button>
        </is-access-to-add>
      </div>
    </div>

    <nav class="flex flex-1 flex-col" aria-label="Sidebar" v-if="documentsByVariantId.length">
      <ul role="list" class="-mx-2 space-y-1">
        <li v-for="document in sortedDocumentsByVariantId" :key="document.title">
          <a
            :href="document.file?.download_url"
            target="_blank"
            :class="[
              'text-gray-700 hover:text-indigo-600 hover:bg-gray-50',
              'group flex w-full justify-between items-center gap-x-3 rounded-md p-2 pl-3 text-sm leading-6 font-semibold'
            ]"
          >
            <span>{{ document.title }}</span>
            <is-access-to-remove :creator-id="document.creator_id">
              <XCircleIcon
                @click.prevent="deleteDocument(document)"
                class="w-5 h-5 text-gray-400 hidden group-hover:text-gray-500 group-hover:block cursor-pointer"
                aria-hidden="true"
              />
            </is-access-to-remove>
          </a>
        </li>
      </ul>
    </nav>
  </div>

  <modal-popup :open="addDocumentPopup" @close="addDocumentPopup = false">
    <template #default>
      <form class="flex flex-col gap-2" @submit.prevent="createNewDocuments">
        <label class="block text-sm font-medium leading-6 text-gray-900">
          <span>Оберіть файли</span>
          <input
            required
            multiple
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
import { XCircleIcon, PlusCircleIcon, ArrowPathIcon } from '@heroicons/vue/24/outline'
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import type IDocument from '@/types/IDocument'
import useDocument from '@/composables/useDocument'
import ModalPopup from '@/components/common/ModalPopup.vue'
import useStorage from '@/composables/useStorage'
import IsAccessToAdd from '@/components/common/IsAccessToAdd.vue'
import IsAccessToRemove from '@/components/common/IsAccessToRemove.vue'

const props = defineProps<{
  variantId: string
}>()

const {
  documentsByVariantId,
  subscribeToDocumentsByVariantId,
  unsubscribeFromDocumentsByVariantId,
  deleteDocument,
  createDocument,
  loadingDocuments
} = useDocument()

const { uploadFile } = useStorage()

const sortedDocumentsByVariantId = computed(() => {
  return [...documentsByVariantId.value].sort((a, b) => {
    return a.title.localeCompare(b.title)
  })
})

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
const newDocuments = ref<IDocument[]>([])
const documentFiles = ref<File[] | null>(null)

const createNewDocuments = async () => {
  addDocumentPopup.value = false

  if (!documentFiles.value) return

  const creating = documentFiles.value.map(async (file) => {
    return await createNewDocument(file)
  })

  loadingDocuments.value = true

  try {
    await Promise.allSettled(creating)
  } catch (e) {
    console.error(e)
  } finally {
    newDocuments.value = []
    documentFiles.value = null
    loadingDocuments.value = false
  }
}
const createNewDocument = async (file: File) => {
  try {
    let document = {} as IDocument
    document.title = file.name
    document.variant_id = props.variantId
    document.file = await uploadFile(file)
    await createDocument({
      ...document
    })
    return true
  } catch (e) {
    console.error(e)
    return false
  }
}
const onFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files) {
    documentFiles.value = [...target.files]
  }
}
</script>

<style scoped lang="scss"></style>
