<template>
  <header-footer>
    <three-column-layout>
      <template #left-column>
        <courses-list />
      </template>
      <template #main>
        <h1>Оберіть курс</h1>
      </template>
      <template #right-column>
        <h1>Оберіть курс</h1>
      </template>
    </three-column-layout>
  </header-footer>
</template>

<script setup lang="ts">
import ThreeColumnLayout from '@/layouts/ThreeColumnLayout.vue'
import CoursesList from '@/components/Course/CoursesList.vue'
import HeaderFooter from '@/layouts/HeaderFooter.vue'
</script>

<style scoped></style>
