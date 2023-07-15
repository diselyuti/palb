<template>
  <div class="flex flex-col gap-2">
    <div class="flex justify-between items center">
      <h1 class="text-2xl">Предмети</h1>

      <div class="flex items-center gap-2">
        <ArrowPathIcon
          v-show="loadingSubjects"
          class="w-5 h-5 text-gray-500 animate-spin"
          aria-hidden="true"
        />
        <is-access-to-add>
          <button @click="addCoursePopup = true" type="button" class="">
            <PlusCircleIcon class="w-5 h-5 text-gray-500" aria-hidden="true" />
          </button>
        </is-access-to-add>
      </div>
    </div>
    <nav class="flex flex-1 flex-col" aria-label="Sidebar">
      <ul role="list" class="-mx-2 space-y-1">
        <router-link
          v-for="subject in sortedSubjectsByCourseId"
          :key="subject.id"
          :to="{
            name: 'professor',
            params: { courseId: courseId, subjectId: subject.id }
          }"
          :class="[
            'text-gray-700 hover:text-indigo-600 hover:bg-gray-50',
            'group flex w-full justify-between items-center gap-x-3 rounded-md p-2 pl-3 text-sm leading-6 font-semibold'
          ]"
          active-class="bg-gray-50 text-indigo-600"
        >
          <span>{{ subject.title }}</span>
          <is-access-to-remove :creator-id='subject.creator_id'>
            <XCircleIcon
              @click.prevent="removeSubject(subject)"
              class="w-5 h-5 text-gray-500 hidden group-hover:block cursor-pointer"
              aria-hidden="true"
            />
          </is-access-to-remove>
        </router-link>
      </ul>
    </nav>
  </div>

  <modal-popup :open="addCoursePopup" @close="addCoursePopup = false">
    <template #default>
      <form class="flex flex-col gap-2" @submit.prevent="createNewSubject">
        <label for="email" class="block text-sm font-medium leading-6 text-gray-900">
          <span>Title</span>
          <input
            required
            v-model="newSubject.title"
            type="text"
            class="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
        </label>
        <div class="flex gap-2">
          <button
            @click="addCoursePopup = false"
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
import useSubject from '@/composables/useSubject'
import type ISubject from '@/types/ISubject'
import { useRouter } from 'vue-router'
import IsAccessToAdd from '@/components/common/IsAccessToAdd.vue'
import IsAccessToRemove from '@/components/common/IsAccessToRemove.vue'

const props = defineProps<{
  courseId: string
}>()

const router = useRouter()

const {
  subjectsByCourseId,
  loadingSubjects,
  subscribeToSubjectsByCourseId,
  unsubscribeFromSubjectsByCourseId,
  deleteSubject,
  createSubject
} = useSubject()

const sortedSubjectsByCourseId = computed(() => {
  return [...subjectsByCourseId.value].sort((a, b) => {
    return a.title.localeCompare(b.title)
  })
})

onMounted(() => {
  subscribeToSubjectsByCourseId(props.courseId)
})

onUnmounted(() => {
  unsubscribeFromSubjectsByCourseId()
})

const courseId = ref(props.courseId)
watch(
  () => props.courseId,
  () => {
    unsubscribeFromSubjectsByCourseId()
    subscribeToSubjectsByCourseId(props.courseId)
    courseId.value = props.courseId
  }
)
const addCoursePopup = ref(false)
const newSubject = ref<ISubject>({
  title: '',
  course_id: ''
})
const createNewSubject = async () => {
  addCoursePopup.value = false

  loadingSubjects.value = true

  await createSubject({
    ...newSubject.value,
    course_id: courseId.value
  } as ISubject)

  loadingSubjects.value = false

  newSubject.value = {
    title: '',
    course_id: ''
  }
}

const removeSubject = async (subject: ISubject) => {
  loadingSubjects.value = true

  await deleteSubject(subject)

  loadingSubjects.value = false

  await router.replace({
    name: 'subject',
    params: {
      courseId: props.courseId
    }
  })
}
</script>

<style scoped lang="scss"></style>
