<template>
  <div class="flex flex-col gap-2">
    <div class="flex justify-between items center">
      <h1 class="text-2xl">Варіанти</h1>

      <div class="flex items-center gap-2">
        <ArrowPathIcon
          v-show="loadingVariants"
          class="w-5 h-5 text-gray-500 animate-spin"
          aria-hidden="true"
        />
        <is-access-to-add>
          <button @click="addVariantPopup = true" type="button">
            <PlusCircleIcon class="w-5 h-5 text-gray-500" aria-hidden="true" />
          </button>
        </is-access-to-add>
      </div>
    </div>

    <nav class="flex flex-1 flex-col" aria-label="Sidebar">
      <ul role="list" class="-mx-2 space-y-1">
        <router-link
          v-for="variant in sortedVariantsByProfessorId"
          :key="variant.id"
          :to="{
            ...goTo,
            params: { variantId: variant.id }
          }"
          :class="[
            'text-gray-700 hover:text-indigo-600 hover:bg-gray-50',
            'group flex w-full justify-between items-center gap-x-3 rounded-md p-2 pl-3 text-sm leading-6 font-semibold'
          ]"
          active-class="bg-gray-50 text-indigo-600"
        >
          <span>{{ variant.title }}</span>
          <is-access-to-remove :creator-id="variant.creator_id">
            <XCircleIcon
              @click.prevent="removeVariant(variant)"
              class="w-5 h-5 text-gray-400 hidden group-hover:text-gray-500 group-hover:block cursor-pointer"
              aria-hidden="true"
            />
          </is-access-to-remove>
        </router-link>
      </ul>
    </nav>
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
            class="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
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
import { XCircleIcon, PlusCircleIcon, ArrowPathIcon } from '@heroicons/vue/24/outline'
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import ModalPopup from '@/components/common/ModalPopup.vue'
import useVariant from '@/composables/useVariant'
import type IVariant from '@/types/IVariant'
import { useRouter } from 'vue-router'
import IsAccessToAdd from '@/components/common/IsAccessToAdd.vue'
import IsAccessToRemove from '@/components/common/IsAccessToRemove.vue'

const props = defineProps<{
  courseId: string
  subjectId: string
  professorId: string
}>()

const router = useRouter()

const {
  variantsByProfessorId,
  loadingVariants,
  subscribeToVariantsByProfessorId,
  unsubscribeFromVariantsByProfessorId,
  deleteVariant,
  createVariant
} = useVariant()

const sortedVariantsByProfessorId = computed(() => {
  return [...variantsByProfessorId.value].sort((a, b) => {
    return a.title.localeCompare(b.title)
  })
})

onMounted(() => {
  subscribeToVariantsByProfessorId(props.professorId)
})

onUnmounted(() => {
  unsubscribeFromVariantsByProfessorId()
})

const professorId = ref(props.professorId)
watch(
  () => props.courseId + props.subjectId + props.professorId,
  () => {
    unsubscribeFromVariantsByProfessorId()
    subscribeToVariantsByProfessorId(props.professorId)
    professorId.value = props.professorId
  }
)
const addVariantPopup = ref(false)
const newVariant = ref<IVariant>({
  title: '',
  professor_id: ''
})
const createNewVariant = async () => {
  addVariantPopup.value = false

  loadingVariants.value = true

  await createVariant({
    ...newVariant.value,
    professor_id: professorId.value
  } as IVariant)

  loadingVariants.value = false

  newVariant.value = {
    title: '',
    professor_id: ''
  }
}

const removeVariant = async (variant: IVariant) => {
  loadingVariants.value = true

  await deleteVariant(variant)

  loadingVariants.value = false
  console.log('removed')

  await router.replace({
    name: 'variant',
    params: {
      courseId: props.courseId,
      subjectId: props.subjectId,
      professorId: props.professorId
    }
  })
}

const goTo = computed(() => ({
  name: 'document',
  params: {
    courseId: props.courseId,
    subjectId: props.subjectId,
    professorId: props.professorId
  }
}))
</script>

<style scoped lang="scss"></style>
