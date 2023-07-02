<template>
  <three-column-layout>
    <template #left-column>
      <professors-list-by-subject-id :course-id="courseId" :subject-id="subjectId" />
    </template>
    <template #main>
      <variants-list-by-professor-id
        :professor-id="professorId"
        :course-id="courseId"
        :subject-id="subjectId"
      />
    </template>
    <template #right-column>
      <h1>Select Variant</h1>
    </template>
  </three-column-layout>
</template>

<script setup lang="ts">
import ThreeColumnLayout from '@/layouts/ThreeColumnLayout.vue'
import { useRoute } from 'vue-router'
import {computed, watch} from 'vue'
import ProfessorsListBySubjectId from '@/components/Professor/ProfessorsListBySubjectId.vue'
import VariantsListByProfessorId from '@/components/Variant/VariantsListByProfessorId.vue'

const route = useRoute()
const courseId = computed(() => route.params.courseId.toString())
const subjectId = computed(() => route.params.subjectId.toString())
const professorId = computed(() => route.params.professorId.toString())
</script>

<style scoped></style>
