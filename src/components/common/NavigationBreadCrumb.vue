<template>
  <nav class="flex justify-center w-full border bg-white" aria-label="Breadcrumb">
    <ol role="list" class="w-full max-w-7xl flex space-x-4 px-6">
      <li class="flex">
        <div class="flex items-center">
          <router-link :to="{ name: 'course' }" class="text-gray-400 hover:text-gray-500">
            <HomeIcon class="h-5 w-5 flex-shrink-0" aria-hidden="true" />
            <span class="sr-only">Home</span>
          </router-link>
        </div>
      </li>
      <li v-for="page in pages" :key="page.name" class="flex">
        <div class="flex items-center">
          <svg
            class="h-full w-6 flex-shrink-0 text-gray-200"
            viewBox="0 0 24 44"
            preserveAspectRatio="none"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M.293 0l22 22-22 22h1.414l22-22-22-22H.293z" />
          </svg>
          <router-link
            :to="page.to"
            class="ml-3 md:ml-4 text-xs md:text-sm font-medium text-gray-500 hover:text-gray-700"
            >{{ page.name }}</router-link
          >
        </div>
      </li>
    </ol>
  </nav>
</template>

<script setup lang="ts">
import { HomeIcon } from '@heroicons/vue/20/solid'
import type IPage from '@/types/IPage'

defineProps<{
  pages: IPage[]
}>()
</script>
