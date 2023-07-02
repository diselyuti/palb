<template>
  <navigation-bread-crumb v-if="pages.length" :pages="pages"/>
  <div class="mx-auto h-full w-full max-w-7xl grow lg:flex xl:px-2">
    <!-- Left sidebar & main wrapper -->
    <div class="flex-1 xl:flex">
      <div
        class="border-b border-gray-200 px-4 py-6 sm:px-6 lg:pl-8 xl:w-96 xl:shrink-0 xl:border-b-0 xl:border-r xl:pl-6"
      >
        <slot name="left-column" />
      </div>

      <div class="px-4 py-6 sm:px-6 lg:pl-8 xl:flex-1 xl:pl-6">
        <slot name="main" />
      </div>
    </div>

    <div
      class="shrink-0 border-t border-gray-200 px-4 py-6 sm:px-6 lg:w-96 lg:border-l lg:border-t-0 lg:pr-8 xl:pr-6"
    >
      <slot name="right-column" />
    </div>
  </div>
</template>

<script setup lang="ts">
import NavigationBreadCrumb from "@/components/common/NavigationBreadCrumb.vue";
import {useRoute} from "vue-router";
import {computed} from "vue";
import type IPage from "@/types/IPage";

const route = useRoute();

const pages = computed(() => {
  const pages: IPage[] =[];

  if (route.params.courseId) {
    pages.push({
      name: 'Course',
      to: {
        name: 'subject',
        params: {
          courseId: route.params.courseId,
        },
      },
    });
  }
  if (route.params.subjectId) {
    pages.push({
      name: 'Subject',
      to: {
        name: 'professor',
        params: {
          courseId: route.params.courseId,
          subjectId: route.params.subjectId,
        },
      },
    });
  }
  if (route.params.professorId) {
    pages.push({
      name: 'Professor',
      to: {
        name: 'variant',
        params: {
          courseId: route.params.courseId,
          subjectId: route.params.subjectId,
          professorId: route.params.professorId,
        },
      },
    });
  }
  return pages;
  // {
  //   name: 'Subject',
  //   to: {
  //     name: 'subject',
  //     params: {
  //       courseId: route.params.courseId,
  //     },
  //   },
  // },
  // {
  //   name: 'Professor',
  //   to: {name: 'professor'},
  // },
  // {
  //   name: 'Variant',
  //   to: {name: 'variant'},
  // },
  // {
  //   name: 'Document',
  //   to: {name: 'document'},
  // }
});
</script>

<style scoped lang="scss"></style>
