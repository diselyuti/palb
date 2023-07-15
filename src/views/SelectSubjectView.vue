<template>
  <header-footer>
    <three-column-layout>
      <template #left-column>
        <courses-list />
      </template>
      <template #main>
        <subjects-list-by-course-id :course-id="courseId" />
      </template>
      <template #right-column>
        <h1>Оберіть предмет</h1>
      </template>
    </three-column-layout>
  </header-footer>
</template>

<script setup lang="ts">
import ThreeColumnLayout from '@/layouts/ThreeColumnLayout.vue'
import CoursesList from '@/components/Course/CoursesList.vue'
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import SubjectsListByCourseId from '@/components/Subject/SubjectsListByCourseId.vue'
import HeaderFooter from '@/layouts/HeaderFooter.vue'

const route = useRoute()
const courseId = computed(() => route.params.courseId.toString())
</script>

<style scoped></style>
