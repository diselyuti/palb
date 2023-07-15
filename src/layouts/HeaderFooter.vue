<template>
  <default-header />
  <slot />
  <default-footer />
</template>

<script setup lang="ts">
import DefaultHeader from '@/components/common/DefaultHeader.vue'
import DefaultFooter from '@/components/common/DefaultFooter.vue'
</script>

<style scoped></style>
