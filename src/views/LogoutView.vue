<template>
  <div></div>
</template>

<script setup lang="ts">
import useAuth from '@/composables/useAuth'
import { onMounted } from 'vue'
import router from '@/router'

const { signOut } = useAuth()

onMounted(() => {
  signOut()
  router.push({ name: 'login' })
})
</script>

<style scoped lang="scss"></style>
