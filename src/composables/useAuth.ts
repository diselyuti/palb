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
  const user = ref<User | null>(null)
  const userClaims = ref<IUserClaims | null>(null)
  onAuthStateChanged(auth, async (userAuth) => {
    if (userAuth) {
      user.value = userAuth
      const token = await userAuth.getIdTokenResult()
      userClaims.value = token.claims as IUserClaims
    } else {
      user.value = null
      userClaims.value = null
    }
  })
  const createUserByEmailAndPassword = async (email: string, password: string) => {
    return createUserWithEmailAndPassword(auth, email, password)
  }

  const signInByEmailAndPassword = async (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password)
  }

  const signInWithGoogle = async () => {
    const provider = new firebase.auth.GoogleAuthProvider()
    await firebase.auth().signInWithRedirect(provider);
  }

  const googleRedirectResult = async () => {
    return firebase.auth().getRedirectResult();
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
    signInWithGoogle,
    googleRedirectResult,
    onAuthChanged,
    signOut,
    isSignedIn,
    setUserRole,
    user,
    userClaims,
    isAdmin,
    isModerator,
  }
}

export default useAuth
