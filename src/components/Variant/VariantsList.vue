<template>
  <div class="flex flex-col gap-2">
    <h1 class="text-2xl">Variants</h1>
    <nav class="flex flex-1 flex-col" aria-label="Sidebar">
      <ul role="list" class="-mx-2 space-y-1">
        <li v-for="variant in variants" :key="variant.title">
          <div
            :class="[
              0
                ? 'bg-gray-50 text-indigo-600'
                : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50',
              'group flex w-full justify-between items-center gap-x-3 rounded-md p-2 pl-3 text-sm leading-6 font-semibold'
            ]"
          >
            <span>{{ variant.title }}</span>
            <XCircleIcon
              @click="deleteVariant(variant)"
              class="w-5 h-5 text-gray-400 group-hover:text-gray-500 cursor-pointer"
              aria-hidden="true"
            />
          </div>
        </li>
      </ul>
    </nav>
    <button
      @click="addVariantPopup = true"
      type="button"
      class="w-full rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
    >
      Add
    </button>
  </div>

  <modal-popup :open="addVariantPopup" @close="addVariantPopup = false">
    <template #default>
      <form class="flex flex-col gap-2" @submit.prevent="createNewVariant">
        <label for="email" class="block text-sm font-medium leading-6 text-gray-900">
          <span>Title</span>
          <input
            required
            v-model="newVariant.title"
            type="text"
            class="block w-full rounded-md border-1 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
        </label>
        <div class="flex gap-2">
          <button
            @click="addVariantPopup = false"
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
import useVariant from '@/composables/useVariant'
import { onMounted, onUnmounted, ref } from 'vue'
import type IVariant from '@/types/IVariant'
import ModalPopup from '@/components/common/ModalPopup.vue'

const { variants, subscribeToVariants, unsubscribeFromVariants, deleteVariant, createVariant } =
  useVariant()

onMounted(() => {
  subscribeToVariants()
})

onUnmounted(() => {
  unsubscribeFromVariants()
})

const addVariantPopup = ref(false)
const newVariant = ref<IVariant>({
  creator_id: '',
  professor_id: 'knvWepjCXRtgoxyxUvZk',
  title: ''
})
const createNewVariant = () => {
  createVariant(newVariant.value)
  addVariantPopup.value = false
}
</script>

<style scoped lang="scss"></style>
