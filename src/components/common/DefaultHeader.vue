<template>
  <header class="bg-white shadow">
    <nav
      class="mx-auto flex max-w-7xl items-center justify-between p-2 lg:px-8"
      aria-label="Global"
    >
      <div class="flex flex-1">
        <div class="hidden lg:flex lg:gap-x-12">
          <a
            v-for="item in navigation"
            :key="item.name"
            :href="item.href"
            class="text-sm font-semibold leading-6 text-indigo-600"
            target="_blank"
            >{{ item.name }}</a
          >
        </div>
        <div class="flex lg:hidden">
          <button
            type="button"
            class="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            @click="mobileMenuOpen = true"
          >
            <span class="sr-only">Open main menu</span>
            <Bars3Icon class="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
      </div>
      <router-link :to="{ name: 'course' }" class="-m-1.5 p-1.5">
        <span class="sr-only">Palb</span>
        <img class="h-8 w-auto" src="/icons/hat-face.svg" alt="" />
      </router-link>
      <div class="flex flex-1 justify-end">
        <router-link
          v-if="!user"
          :to="{ name: 'login' }"
          class="text-sm font-semibold leading-6 text-gray-900"
        >
          Увійти
          <span aria-hidden="true">&rarr;</span>
        </router-link>
      </div>
    </nav>
    <Dialog as="div" class="lg:hidden" @close="mobileMenuOpen = false" :open="mobileMenuOpen">
      <div class="fixed inset-0 z-10" />
      <DialogPanel class="fixed inset-y-0 left-0 z-10 w-full overflow-y-auto bg-white px-6 py-6">
        <div class="flex items-center justify-between">
          <div class="flex flex-1">
            <button
              type="button"
              class="-m-2.5 rounded-md p-2.5 text-gray-700"
              @click="mobileMenuOpen = false"
            >
              <span class="sr-only">Close menu</span>
              <XMarkIcon class="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <a href="#" class="-m-1.5 p-1.5">
            <span class="sr-only">Your Company</span>
            <img class="h-8 w-auto" src="/icons/hat-face.svg" alt="" />
          </a>
          <div class="flex flex-1 justify-end">
            <router-link
              v-if="!user"
              :to="{ name: 'login' }"
              class="text-sm font-semibold leading-6 text-gray-900"
            >
              Увійти
              <span aria-hidden="true">&rarr;</span>
            </router-link>
          </div>
        </div>
        <div class="mt-6 space-y-2">
          <a
            v-for="item in navigation"
            :key="item.name"
            :href="item.href"
            class="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
            >{{ item.name }}</a
          >
        </div>
      </DialogPanel>
    </Dialog>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Dialog, DialogPanel } from '@headlessui/vue'
import { Bars3Icon, XMarkIcon } from '@heroicons/vue/24/outline'
import useAuth from '@/composables/useAuth'

const navigation = [
  {
    name: 'Донат у Фонд Притули',
    href: 'https://prytulafoundation.org/'
  },
  {
    name: 'Донат в United24',
    href: 'https://u24.gov.ua/uk'
  }
]

const { user } = useAuth()

const mobileMenuOpen = ref(false)
</script>
