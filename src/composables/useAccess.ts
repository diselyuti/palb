import useAuth from '@/composables/useAuth'
import { computed } from 'vue'

const useAccess = () => {
  const { isAdmin, isModerator } = useAuth()

  const canDelete = computed<Boolean>(() => {
    return isAdmin.value || isModerator.value
  })

  return {
    canDelete
  }
}

export default useAccess
