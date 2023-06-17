<template>
  <div class="flex flex-col gap-10">
    <div>
      <h1 class="font-bold text-4xl">Files</h1>
      <input type="file" @change="handleFileChange" />
      <button @click="upload">Upload</button>
      <button @click="remove">Remove</button>
    </div>

    <div>
      <h1 class="font-bold text-4xl">Documents</h1>
      <button @click="getDocuments">Get all documents</button>
      <button @click="addDocument">Add Document</button>
      <ul>
        <li v-for="doc in documents" :key="doc" class="border m-2 overflow-auto">
          <pre>{{ doc }}</pre>
          <button @click="deleteDocument(doc)">Delete</button>
          <button
            @click="
              updateDocument({
                ...doc,
                title: 'Updated Title',
                file: file
              })
            "
          >
            Update
          </button>
        </li>
      </ul>
    </div>

    <div>
      <h1 class="font-bold text-4xl">Variants</h1>
      <button @click="getVariants">Get all variants</button>
      <button @click="addVariant">Add Variant</button>
      <ul>
        <li v-for="variant in variants" :key="variant" class="border m-2 overflow-auto">
          <pre>{{ variant }}</pre>
          <button @click="deleteVariant(variant)">Delete</button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import useStorage from '@/composables/useStorage'
import { ref } from 'vue'
import type IFile from '@/types/IFile'
import useDocument from '@/composables/useDocument'
import type IDocument from '@/types/IDocument'
import type IVariant from "@/types/IVariant";
import useVariant from "@/composables/useVariant";

const { uploadFile, deleteFile } = useStorage()

const fileRef = ref<File | null>(null)
const file = ref<IFile | null>(null)

const handleFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  const files = target.files
  if (files) {
    fileRef.value = files[0]
  }
}

const upload = async () => {
  if (fileRef.value !== null) {
    file.value = await uploadFile(fileRef.value)
  }
}

const remove = () => {
  if (file.value) {
    deleteFile(file.value)
  }
}

const { getAllDocuments, createDocument, deleteDocument, updateDocument } = useDocument()

const documents = ref<IDocument[]>([])
const newDocument = ref<IDocument | null>(null)
const getDocuments = async () => {
  documents.value = await getAllDocuments()
}

const addDocument = async () => {
  newDocument.value = {
    title: 'New Document',
    variant_id: 'BhvYAmFba2DGYKxFmFkk',
    file: file.value
  }
  if (newDocument.value) {
    await createDocument(newDocument.value)
  }
}


const variants = ref<IVariant[]>([])
const newVariant = ref<IVariant | null>(null)

const { getAllVariants, deleteVariant, createVariant } = useVariant()
const getVariants = async () => {
  variants.value = await getAllVariants()
}
const addVariant = async () => {
  newVariant.value = {
    title: 'New Variant',
    professor_id: 'knvWepjCXRtgoxyxUvZk',
  }
  if (newVariant.value) {
    await createVariant(newVariant.value)
  }
}
</script>

<style scoped lang="scss">
button {
  padding: 10px 20px;
  border-radius: 5px;
  border: 1px solid #ccc;
  background-color: #fff;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  &:hover {
    background-color: #ccc;
  }
}
</style>
