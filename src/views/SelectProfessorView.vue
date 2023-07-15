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
        <professors-list-by-subject-id :course-id="courseId" :subject-id="subjectId" />
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
import ProfessorsListBySubjectId from '@/components/Professor/ProfessorsListBySubjectId.vue'
import HeaderFooter from '@/layouts/HeaderFooter.vue'

const route = useRoute()
const courseId = computed(() => route.params.courseId.toString())
const subjectId = computed(() => route.params.subjectId.toString())
</script>

<style scoped></style>
