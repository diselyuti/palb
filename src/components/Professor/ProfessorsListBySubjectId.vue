<template>
  <div class="flex flex-col gap-2">
    <div class="flex justify-between items center">
      <h1 class="text-2xl">Професори</h1>

      <div class="flex items-center gap-2">
        <ArrowPathIcon
          v-show="loadingProfessors"
          class="w-5 h-5 text-gray-500 animate-spin"
          aria-hidden="true"
        />
        <is-access-to-add>
          <button @click="addProfessorPopup = true" type="button" class="">
            <PlusCircleIcon class="w-5 h-5 text-gray-500" aria-hidden="true" />
          </button>
        </is-access-to-add>
      </div>
    </div>

    <nav class="flex flex-1 flex-col" aria-label="Sidebar">
      <ul role="list" class="-mx-2 space-y-1">
        <router-link
          v-for="professor in sortedProfessorsBySubjectId"
          :key="professor.id"
          :to="{
            name: 'variant',
            params: { courseId: courseId, subjectId: subjectId, professorId: professor.id }
          }"
          :class="[
            'text-gray-700 hover:text-indigo-600 hover:bg-gray-50',
            'group flex w-full justify-between items-center gap-x-3 rounded-md p-2 pl-3 text-sm leading-6 font-semibold'
          ]"
          active-class="bg-gray-50 text-indigo-600"
        >
          <span>{{ professor.title }}</span>
          <is-access-to-remove :creator-id="professor.creator_id">
            <XCircleIcon
              @click.prevent="removeProfessor(professor)"
              class="w-5 h-5 text-gray-400 hidden group-hover:text-gray-500 group-hover:block cursor-pointer"
              aria-hidden="true"
            />
          </is-access-to-remove>
        </router-link>
      </ul>
    </nav>
  </div>

  <modal-popup :open="addProfessorPopup" @close="addProfessorPopup = false">
    <template #default>
      <form class="flex flex-col gap-2" @submit.prevent="createNewProfessor">
        <label for="email" class="block text-sm font-medium leading-6 text-gray-900">
          <span>Title</span>
          <input
            required
            v-model="newProfessor.title"
            type="text"
            class="block w-full rounded-md border-1 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
        </label>
        <div class="flex gap-2">
          <button
            @click="addProfessorPopup = false"
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
import { ArrowPathIcon, PlusCircleIcon, XCircleIcon } from '@heroicons/vue/24/outline'
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import ModalPopup from '@/components/common/ModalPopup.vue'
import useProfessor from '@/composables/useProfessor'
import type IProfessor from '@/types/IProfessor'
import { useRouter } from 'vue-router'
import IsAccessToAdd from '@/components/common/IsAccessToAdd.vue'
import IsAccessToRemove from '@/components/common/IsAccessToRemove.vue'

const props = defineProps<{
  courseId: string
  subjectId: string
}>()

const router = useRouter()

const {
  professorsBySubjectId,
  loadingProfessors,
  subscribeToProfessorsBySubjectId,
  unsubscribeFromProfessorsBySubjectId,
  deleteProfessor,
  createProfessor
} = useProfessor()

const sortedProfessorsBySubjectId = computed(() => {
  return [...professorsBySubjectId.value].sort((a, b) => {
    return a.title.localeCompare(b.title)
  })
})

onMounted(() => {
  subscribeToProfessorsBySubjectId(props.subjectId)
})

onUnmounted(() => {
  unsubscribeFromProfessorsBySubjectId()
})

const subjectId = ref(props.subjectId)
watch(
  () => props.courseId + props.subjectId,
  () => {
    unsubscribeFromProfessorsBySubjectId()
    subscribeToProfessorsBySubjectId(props.subjectId)
    subjectId.value = props.subjectId
  }
)
const addProfessorPopup = ref(false)
const newProfessor = ref<IProfessor>({
  creator_id: '',
  title: '',
  subject_id: ''
})
const createNewProfessor = async () => {
  addProfessorPopup.value = false

  loadingProfessors.value = true

  await createProfessor({
    ...newProfessor.value,
    subject_id: subjectId.value
  } as IProfessor)

  loadingProfessors.value = false

  newProfessor.value = {
    creator_id: '',
    title: '',
    subject_id: ''
  }
}

const removeProfessor = async (professor: IProfessor) => {
  loadingProfessors.value = true

  await deleteProfessor(professor)

  loadingProfessors.value = false

  await router.replace({
    name: 'professor',
    params: {
      courseId: props.courseId,
      subjectId: props.subjectId
    }
  })
}
</script>

<style scoped lang="scss"></style>
