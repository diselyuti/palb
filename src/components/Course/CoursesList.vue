<template>
  <div class="flex flex-col gap-2">
    <div class="flex justify-between items-center">
      <h1 class="text-2xl">Courses</h1>

      <div class="flex items-center gap-2">
        <ArrowPathIcon
          v-show="loadingCourses"
          class="w-5 h-5 text-gray-500 animate-spin"
          aria-hidden="true"
        />
        <button @click="addCoursePopup = true" type="button" class="">
          <PlusCircleIcon class="w-5 h-5 text-gray-500" aria-hidden="true" />
        </button>
      </div>
    </div>
    <nav class="flex flex-1 flex-col" aria-label="Sidebar">
      <ul role="list" class="-mx-2 space-y-1">
        <router-link
          v-for="course in sortedCourses"
          :key="course.id"
          :to="{
            name: 'subject',
            params: { courseId: course.id }
          }"
          :class="[
            'text-gray-700 hover:text-indigo-600 hover:bg-gray-50',
            'group flex w-full justify-between items-center gap-x-3 rounded-md p-2 pl-3 text-sm leading-6 font-semibold'
          ]"
          active-class="bg-gray-50 text-indigo-600"
        >
          <span>{{ course.title }}</span>
          <XCircleIcon
            @click="removeCourse(course)"
            class="w-5 h-5 text-gray-500 hidden group-hover:block cursor-pointer"
            aria-hidden="true"
          />
        </router-link>
      </ul>
    </nav>
  </div>

  <modal-popup :open="addCoursePopup" @close="addCoursePopup = false">
    <template #default>
      <form class="flex flex-col gap-2" @submit.prevent="createNewCourse">
        <label for="email" class="block text-sm font-medium leading-6 text-gray-900">
          <span>Title</span>
          <input
            required
            v-model="newCourse.title"
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
import { XCircleIcon, PlusCircleIcon, ArrowPathIcon } from '@heroicons/vue/24/outline'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import ModalPopup from '@/components/common/ModalPopup.vue'
import useCourse from '@/composables/useCourse'
import type ICourse from '@/types/ICourse'
import { useRouter } from 'vue-router'

const router = useRouter()

const {
  courses,
  loadingCourses,
  subscribeToCourses,
  unsubscribeFromCourses,
  deleteCourse,
  createCourse
} = useCourse()

const sortedCourses = computed(() => {
  return [...courses.value].sort((a, b) => {
    return a.title.localeCompare(b.title)
  })
})

onMounted(() => {
  subscribeToCourses()
})

onUnmounted(() => {
  unsubscribeFromCourses()
})

const addCoursePopup = ref(false)
const newCourse = ref<ICourse>({
  title: ''
})

const createNewCourse = async () => {
  addCoursePopup.value = false
  await createCourse(newCourse.value)
  newCourse.value = {
    title: ''
  }
}

const removeCourse = async (course: ICourse) => {
  await deleteCourse(course)

  await router.replace({
    name: 'course'
  })
}
</script>

<style scoped lang="scss"></style>
