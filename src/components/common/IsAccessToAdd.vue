<template>
  <template v-if='user'>
    <slot></slot>
  </template>
  <template v-else>
    <button @click="addPopup = true" type="button" class="">
      <PlusCircleIcon class="w-5 h-5 text-gray-500" aria-hidden="true" />
    </button>
    <modal-popup :open='addPopup' @close='addPopup = false'>
      <div>
        <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
          <AcademicCapIcon class="h-6 w-6 text-green-600" aria-hidden="true" />
        </div>
        <div class="mt-3 text-center sm:mt-5">
          <DialogTitle as="h3" class="text-base font-semibold leading-6 text-gray-900">Дякую за ініціативу!</DialogTitle>
          <div class="mt-2">
            <p class="text-sm text-gray-500">Увійди або зареєструйся щоб мати змогу додавати/видаляти матеріали. Це потрібно, щоб кожен користувач міг видалити тільки ті матеріали, які він створив.</p>
          </div>
        </div>
      </div>
      <div class="mt-5 sm:mt-6">
        <router-link :to='{name: "login"}' type="button" class="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600" @click="open = false">Авторизуватися</router-link>
      </div>
    </modal-popup>
  </template>
</template>

<script setup lang='ts'>
import useAuth from '@/composables/useAuth'
import { ref } from 'vue'
import { PlusCircleIcon } from '@heroicons/vue/24/outline'
import ModalPopup from '@/components/common/ModalPopup.vue'
import { AcademicCapIcon } from '@heroicons/vue/24/outline'
import { DialogTitle } from '@headlessui/vue'

const { onAuthChanged } = useAuth();

const user = ref(null);
const addPopup = ref(false);

onAuthChanged((authUser) => {
  user.value = authUser;
});
</script>

<style scoped lang='scss'>

</style>
