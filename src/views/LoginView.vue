<template>
  <div class="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8">
    <router-link :to="{ name: 'course' }" class="w-full flex justify-center">
      <img src="/icons/hat-face.svg" alt="logo" class="h-10" />
    </router-link>

    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <h2 class="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
        Увійдіть у свій акаунт
      </h2>
    </div>

    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
      <div class="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
        <form class="space-y-6" @submit.prevent="onSubmit">
          <div>
            <label for="email" class="block text-sm font-medium leading-6 text-gray-900"
              >Електронна пошта</label
            >
            <div class="mt-2">
              <input
                v-bind="email"
                id="email"
                name="email"
                type="email"
                autocomplete="email"
                required
                class="block w-full rounded-md border-1 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
              <div class="text-red-500 text-xs">{{ errors.email }}</div>
            </div>
          </div>

          <div>
            <label for="password" class="block text-sm font-medium leading-6 text-gray-900"
              >Пароль</label
            >
            <div class="mt-2">
              <input
                v-bind="password"
                id="password"
                name="password"
                type="password"
                autocomplete="new-password"
                required
                class="block w-full rounded-md border-1 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
              <div class="text-red-500 text-xs">{{ errors.password }}</div>
            </div>
          </div>

          <div class="flex items-center justify-between">
            <div class="text-sm leading-6">
              <a href="#" class="font-semibold text-indigo-600 hover:text-indigo-500"
                >Забули пароль?</a
              >
            </div>
          </div>

          <div class="w-full flex">
            <p class="text-red-500">{{ errorMessage }}</p>
          </div>

          <div class="flex flex-col gap-3">
            <div>
              <button
                type="submit"
                class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Увійти
              </button>
            </div>

            <div>
              <router-link
                :to="{ name: 'register' }"
                class="flex w-full justify-center rounded-md bg-white px-3 py-1.5 text-sm font-semibold leading-6 text-indigo-600 shadow focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Зареєструватися
              </router-link>
            </div>
          </div>
        </form>

        <div>
          <div class="relative mt-10">
            <div class="absolute inset-0 flex items-center" aria-hidden="true">
              <div class="w-full border-t border-gray-200" />
            </div>
            <div class="relative flex justify-center text-sm font-medium leading-6">
              <span class="bg-white px-6 text-gray-900">Або увійти з</span>
            </div>
          </div>

          <div class="mt-6 grid grid-cols-1 gap-4">
            <button
              @click="signInWithGoogle"
              class="flex w-full items-center justify-center gap-3 rounded-md bg-white shadow px-3 py-1.5 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D9BF0]"
            >
              <img src="/icons/google-icon.svg" alt="google icon" class="w-5" />
              <span class="text-black text-sm font-semibold leading-6">Google</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <Footer />
</template>

<script setup lang="ts">
import { useForm } from 'vee-validate'
import * as yup from 'yup'
import useAuth from '@/composables/useAuth'
import { onMounted, ref } from 'vue'
import router from '@/router'
import { AUTH_ERROR_CODES_MAP } from '@/data/AuthErrorCodeMessages'
import Footer from '@/components/common/DefaultFooter.vue'
import { FirebaseError } from '@firebase/util'

const schema = yup.object({
  email: yup.string().required('Обов`язкове поле').email('Невірний формат email'),
  password: yup.string().required('Обов`язкове поле').min(6, 'Мінімум 6 символів')
})

const { values, errors, defineInputBinds } = useForm({
  validationSchema: schema
})

const email = defineInputBinds('email')
const password = defineInputBinds('password')

const errorMessage = ref<string>('')

const { signInByEmailAndPassword, onAuthChanged, signInWithGoogle, googleRedirectResult } =
  useAuth()
const onSubmit = async () => {
  try {
    errorMessage.value = ''
    await signInByEmailAndPassword(values.email, values.password)
  } catch (e) {
    if (e instanceof FirebaseError) {
      // @ts-ignore
      errorMessage.value = AUTH_ERROR_CODES_MAP[e.code] || e.message
    }
  }
}

onAuthChanged((user) => {
  if (user) {
    router.push({ name: 'course' })
  }
})

onMounted(() => {
  googleRedirectResult().then((result) => {
    if (result.user) {
      router.push({ name: 'course' })
    }
  })
})
</script>
