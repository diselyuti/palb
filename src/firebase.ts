import firebase from 'firebase/compat/app'
import 'firebase/compat/firestore'
import 'firebase/compat/auth'
import 'firebase/compat/storage'
import 'firebase/compat/functions'
import firebaseConfig from '@/firebase.json' assert { type: 'json' }

firebase.initializeApp(firebaseConfig)
firebase.functions().useEmulator('localhost', 5001)

export const db = firebase.firestore()
export const auth = firebase.auth()
export const storage = firebase.storage()
