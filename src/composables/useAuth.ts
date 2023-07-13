import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged
} from '@firebase/auth'
import firebase from 'firebase/compat/app'
import { auth } from '@/firebase'
import type { NextOrObserver, User } from '@firebase/auth'
import { computed, ref } from 'vue'
import type { IUserClaims } from '@/types/IUserClaims'

const useAuth = () => {
  const userClaims = ref<IUserClaims | null>(null)
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      const token = await user.getIdTokenResult()
      userClaims.value = token.claims as IUserClaims
    } else {
      userClaims.value = null
    }
  })
  const createUserByEmailAndPassword = async (email: string, password: string) => {
    const userCredential = createUserWithEmailAndPassword(auth, email, password)
    await setUserRole(email, 'viewer')
    return userCredential
  }

  const signInByEmailAndPassword = async (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password)
  }

  const onAuthChanged = (callback: NextOrObserver<User>): void => {
    onAuthStateChanged(auth, callback)
  }

  const signOut = async (): Promise<void> => {
    await auth.signOut()
  }

  const isSignedIn = (): boolean => {
    return auth.currentUser !== null
  }

  const setUserRole = async (email: string, role: string) => {
    const setRole = firebase.functions().httpsCallable('setRole')
    await setRole({ email, role })
  }

  const isAdmin = computed((): boolean => {
    return userClaims.value?.admin ?? false
  })

  const isModerator = computed((): boolean => {
    return userClaims.value?.moderator ?? false
  })

  return {
    createUserByEmailAndPassword,
    signInByEmailAndPassword,
    onAuthChanged,
    signOut,
    isSignedIn,
    setUserRole,
    userClaims,
    isAdmin,
    isModerator
  }
}

export default useAuth
