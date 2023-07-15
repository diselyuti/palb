import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  query,
  updateDoc,
  where
} from '@firebase/firestore'
import type { Unsubscribe } from 'firebase/firestore'
import { db } from '@/firebase'
import { ref } from 'vue'
import type IProfessor from '@/types/IProfessor'
import useVariant from '@/composables/useVariant'
import useAuth from '@/composables/useAuth'

const useProfessor = () => {
  const { user } = useAuth()
  const { deleteVariantsByProfessorId } = useVariant()
  const professors = ref<IProfessor[]>([])
  const professorsBySubjectId = ref<IProfessor[]>([])
  const loadingProfessors = ref<boolean>(false)
  let _unsubscribeFromProfessors: Unsubscribe | null = null
  let _unsubscribeFromProfessorsBySubjectId: Unsubscribe | null = null

  const getAllProfessors = async (): Promise<IProfessor[]> => {
    const q = query(collection(db, 'professor'))

    loadingProfessors.value = true

    const querySnapshot = await getDocs(q)
    const professors: IProfessor[] = []
    querySnapshot.forEach((doc) => {
      professors.push({
        id: doc.id,
        ...doc.data()
      } as IProfessor)
    })

    loadingProfessors.value = false

    return professors
  }

  const getProfessorsBySubjectId = async (subjectId: string): Promise<IProfessor[]> => {
    const q = query(collection(db, 'professor'), where('subject_id', '==', subjectId))

    loadingProfessors.value = true

    const querySnapshot = await getDocs(q)
    const professors: IProfessor[] = []
    querySnapshot.forEach((doc) => {
      professors.push({
        id: doc.id,
        ...doc.data()
      } as IProfessor)
    })

    loadingProfessors.value = false

    return professors
  }

  const createProfessor = async (professor: IProfessor | null) => {
    if (!professor) throw new Error('No professor provided')

    loadingProfessors.value = true

    professor.creator_id = user.value.uid
    await addDoc(collection(db, 'professor'), professor)

    loadingProfessors.value = false
  }

  const updateProfessor = async (professor: IProfessor | null) => {
    if (!professor) throw new Error('No professor provided')
    if (!professor.id) throw new Error('No professor id provided')

    const professorRef = doc(db, 'professor', professor.id)

    loadingProfessors.value = true

    await updateDoc(professorRef, {
      ...professor
    })

    loadingProfessors.value = false
  }

  const deleteProfessor = async (professor: IProfessor | null) => {
    if (!professor) throw new Error('No professor provided')
    if (!professor.id) throw new Error('No professor id provided')

    loadingProfessors.value = true

    await deleteVariantsByProfessorId(professor.id)
    await deleteDoc(doc(db, 'professor', professor.id))

    loadingProfessors.value = false
  }

  const deleteProfessorsBySubjectId = async (subjectId: string) => {
    const professors = await getProfessorsBySubjectId(subjectId)
    const deleting = professors.map(async (professor) => {
      await deleteProfessor(professor)
    })

    loadingProfessors.value = true

    await Promise.all(deleting)

    loadingProfessors.value = false
  }

  const subscribeToProfessors = async () => {
    _unsubscribeFromProfessors = onSnapshot(collection(db, 'professor'), (snapshot) => {
      professors.value = snapshot.docs.map((doc) => {
        return {
          id: doc.id,
          ...doc.data()
        } as IProfessor
      })
    })
  }

  const subscribeToProfessorsBySubjectId = async (subjectId: string) => {
    const q = query(collection(db, 'professor'), where('subject_id', '==', subjectId))
    _unsubscribeFromProfessorsBySubjectId = onSnapshot(q, (snapshot) => {
      professorsBySubjectId.value = snapshot.docs.map((doc) => {
        return {
          id: doc.id,
          ...doc.data()
        } as IProfessor
      })
    })
  }

  const unsubscribeFromProfessors = () => {
    if (_unsubscribeFromProfessors) {
      _unsubscribeFromProfessors()
      _unsubscribeFromProfessors = null
    }
  }

  const unsubscribeFromProfessorsBySubjectId = () => {
    if (_unsubscribeFromProfessorsBySubjectId) {
      _unsubscribeFromProfessorsBySubjectId()
      _unsubscribeFromProfessorsBySubjectId = null
    }
  }

  return {
    createProfessor,
    updateProfessor,
    deleteProfessor,
    deleteProfessorsBySubjectId,
    getAllProfessors,
    getProfessorsBySubjectId,
    professors,
    professorsBySubjectId,
    loadingProfessors,
    subscribeToProfessors,
    subscribeToProfessorsBySubjectId,
    unsubscribeFromProfessors,
    unsubscribeFromProfessorsBySubjectId
  }
}

export default useProfessor
