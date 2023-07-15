<template>
  <header-footer>
    <three-column-layout>
      <template #left-column>
        <professors-list />
      </template>
      <template #main>
        <variants-list />
      </template>
      <template #right-column>
        <documents-list />
      </template>
    </three-column-layout>
  </header-footer>
</template>

<script setup lang="ts">
import ThreeColumnLayout from '@/layouts/ThreeColumnLayout.vue'
import DocumentsList from '@/components/Document/DocumentsList.vue'
import VariantsList from '@/components/Variant/VariantsList.vue'
import ProfessorsList from '@/components/Professor/ProfessorsList.vue'
import HeaderFooter from '@/layouts/HeaderFooter.vue'
</script>

<style scoped lang="scss"></style>
