<template>
  <div class="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <h2 class="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
        Give access
      </h2>
      <h3 class="mt-2 text-center text-xl leading-9 tracking-tight text-gray-900">
        Your level:
        <span v-if="userClaims?.admin">Admin</span>
        <span v-if="userClaims?.moderator">Moderator</span>
        <span v-if="userClaims?.viewer">Viewer</span>
      </h3>
    </div>

    <div class="mt-5 sm:mx-auto sm:w-full sm:max-w-[480px]">
      <div class="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
        <form class="space-y-6" @submit.prevent="onSubmit">
          <div>
            <label for="email" class="block text-sm font-medium leading-6 text-gray-900"
              >Email address</label
            >
            <div class="mt-2">
              <input
                v-bind="email"
                id="email"
                name="email"
                type="email"
                autocomplete="email"
                required
                class="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
              <div>{{ errors.email }}</div>
            </div>
          </div>

          <div>
            <label for="role" class="block text-sm font-medium leading-6 text-gray-900"
              >Access level</label
            >
            <select
              v-bind="role"
              id="role"
              name="role"
              class="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
            >
              <option selected value="admin">Admin</option>
              <option value="moderator">Moderator</option>
              <option value="viewer">Viewer</option>
            </select>
          </div>

          <div>
            <button
              type="submit"
              class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Give access
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useForm } from 'vee-validate'
import * as yup from 'yup'
import useAuth from '@/composables/useAuth'

const schema = yup.object({
  email: yup.string().required('Required').email('Invalid email'),
  role: yup.string().required('Required').oneOf(['admin', 'moderator', 'viewer'], 'Invalid role')
})

const { values, errors, defineInputBinds } = useForm({
  validationSchema: schema
})

const email = defineInputBinds('email')
const role = defineInputBinds('role')

const { setUserRole, userClaims } = useAuth()
const onSubmit = async () => {
  try {
    await setUserRole(values.email, values.role)
  } catch (e) {
    console.log(e)
  }
}
</script>
