<template>
  <template v-if='!user'>
    <button @click.prevent="removePopup = true" type="button" class="">
      <XCircleIcon class="w-5 h-5 text-gray-500 hidden group-hover:block cursor-pointer" aria-hidden="true" />
    </button>
    <modal-popup :open='removePopup' @close='removePopup = false'>
      <div>
        <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
          <ArchiveBoxXMarkIcon class="h-6 w-6 text-red-600" aria-hidden="true" />
        </div>
        <div class="mt-3 text-center sm:mt-5">
          <DialogTitle as="h3" class="text-base font-semibold leading-6 text-gray-900">Хочеш видалити?</DialogTitle>
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
  <template v-else-if='canDelete'>
    <slot/>
  </template>
  <template v-else-if='user?.uid !== creatorId'>
  </template>
  <template v-else>
    <slot/>
  </template>
</template>

<script setup lang='ts'>
import { ArchiveBoxXMarkIcon, XCircleIcon } from '@heroicons/vue/24/outline'
import ModalPopup from '@/components/common/ModalPopup.vue'
import { DialogTitle } from '@headlessui/vue'
import useAuth from '@/composables/useAuth'
import { ref } from 'vue'
import useAccess from '@/composables/useAccess'

defineProps<{
  creatorId: string
}>();

const { user } = useAuth();
const { canDelete } = useAccess();

const removePopup = ref<Boolean>(false);
</script>

<style scoped lang='scss'>

</style>
