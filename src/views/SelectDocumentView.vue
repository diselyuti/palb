<template>
  <header-footer>
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
        <documents-list-by-variant-id :variant-id="variantId" />
      </template>
    </three-column-layout>
  </header-footer>
</template>

<script setup lang="ts">
import ThreeColumnLayout from '@/layouts/ThreeColumnLayout.vue'
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import ProfessorsListBySubjectId from '@/components/Professor/ProfessorsListBySubjectId.vue'
import VariantsListByProfessorId from '@/components/Variant/VariantsListByProfessorId.vue'
import DocumentsListByVariantId from '@/components/Document/DocumentsListByVariantId.vue'
import HeaderFooter from '@/layouts/HeaderFooter.vue'

const route = useRoute()
const courseId = computed(() => route.params.courseId.toString())
const subjectId = computed(() => route.params.subjectId.toString())
const professorId = computed(() => route.params.professorId.toString())
const variantId = computed(() => route.params.variantId.toString())
</script>

<style scoped></style>
