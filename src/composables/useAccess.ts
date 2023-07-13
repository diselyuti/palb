import useAuth from '@/composables/useAuth'

const useAccess = () => {
  const { isAdmin, isModerator } = useAuth()

  const canDelete = (): boolean => {
    return isAdmin.value || isModerator.value
  }

  return {
    canDelete
  }
}

export default useAccess
