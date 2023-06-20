<template>
  <three-column-layout>
    <template #left-column>
      <courses-list />
    </template>
    <template #main>
      <h1>Select course</h1>
    </template>
    <template #right-column>
      <h1>Select course</h1>
    </template>
  </three-column-layout>
</template>

<script setup lang="ts">
import ThreeColumnLayout from '@/layouts/ThreeColumnLayout.vue'
import CoursesList from '@/components/Course/CoursesList.vue'
</script>

<style scoped></style>
