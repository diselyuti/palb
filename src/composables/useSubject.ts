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
import useProfessor from '@/composables/useProfessor'
import type ISubject from '@/types/ISubject'
import useAuth from '@/composables/useAuth'

const useSubject = () => {
  const { user } = useAuth()
  const { deleteProfessorsBySubjectId } = useProfessor()
  const subjects = ref<ISubject[]>([])
  const subjectsByCourseId = ref<ISubject[]>([])
  const loadingSubjects = ref<boolean>(false)
  let _unsubscribeFromSubjects: Unsubscribe | null = null
  let _unsubscribeFromSubjectsByCourseId: Unsubscribe | null = null

  const getAllSubjects = async (): Promise<ISubject[]> => {
    const q = query(collection(db, 'subject'))

    loadingSubjects.value = true

    const querySnapshot = await getDocs(q)
    const subjects: ISubject[] = []
    querySnapshot.forEach((doc) => {
      subjects.push({
        id: doc.id,
        ...doc.data()
      } as ISubject)
    })

    loadingSubjects.value = false

    return subjects
  }

  const getSubjectsByCourseId = async (courseId: string): Promise<ISubject[]> => {
    const q = query(collection(db, 'subject'), where('course_id', '==', courseId))

    loadingSubjects.value = true

    const querySnapshot = await getDocs(q)
    const subjects: ISubject[] = []
    querySnapshot.forEach((doc) => {
      subjects.push({
        id: doc.id,
        ...doc.data()
      } as ISubject)
    })

    loadingSubjects.value = false

    return subjects
  }

  const createSubject = async (subject: ISubject | null) => {
    if (!subject) throw new Error('No subject provided')

    loadingSubjects.value = true

    subject.creator_id = user.value.uid
    await addDoc(collection(db, 'subject'), subject)

    loadingSubjects.value = false
  }

  const updateSubject = async (subject: ISubject | null) => {
    if (!subject) throw new Error('No subject provided')
    if (!subject.id) throw new Error('No subject id provided')

    const subjectRef = doc(db, 'subject', subject.id)

    loadingSubjects.value = true

    await updateDoc(subjectRef, {
      ...subject
    })

    loadingSubjects.value = false
  }

  const deleteSubject = async (subject: ISubject | null) => {
    if (!subject) throw new Error('No subject provided')
    if (!subject.id) throw new Error('No subject id provided')

    loadingSubjects.value = true

    await deleteProfessorsBySubjectId(subject.id)
    await deleteDoc(doc(db, 'subject', subject.id))

    loadingSubjects.value = false
  }

  const deleteSubjectsByCourseId = async (courseId: string) => {
    const subjects = await getSubjectsByCourseId(courseId)
    const deleting = subjects.map(async (subject) => {
      await deleteSubject(subject)
    })

    loadingSubjects.value = true

    await Promise.all(deleting)

    loadingSubjects.value = false
  }

  const subscribeToSubjects = async () => {
    _unsubscribeFromSubjects = onSnapshot(collection(db, 'subject'), (snapshot) => {
      subjects.value = snapshot.docs.map((doc) => {
        return {
          id: doc.id,
          ...doc.data()
        } as ISubject
      })
    })
  }

  const subscribeToSubjectsByCourseId = async (courseId: string) => {
    const q = query(collection(db, 'subject'), where('course_id', '==', courseId))
    _unsubscribeFromSubjectsByCourseId = onSnapshot(q, (snapshot) => {
      subjectsByCourseId.value = snapshot.docs.map((doc) => {
        return {
          id: doc.id,
          ...doc.data()
        } as ISubject
      })
    })
  }

  const unsubscribeFromSubjects = () => {
    if (_unsubscribeFromSubjects) {
      _unsubscribeFromSubjects()
      _unsubscribeFromSubjects = null
    }
  }

  const unsubscribeFromSubjectsByCourseId = () => {
    if (_unsubscribeFromSubjectsByCourseId) {
      _unsubscribeFromSubjectsByCourseId()
      _unsubscribeFromSubjectsByCourseId = null
    }
  }

  return {
    createSubject,
    updateSubject,
    deleteSubject,
    deleteSubjectsByCourseId,
    getAllSubjects,
    getSubjectsByCourseId,
    subjects,
    subjectsByCourseId,
    loadingSubjects,
    subscribeToSubjects,
    subscribeToSubjectsByCourseId,
    unsubscribeFromSubjects,
    unsubscribeFromSubjectsByCourseId
  }
}

export default useSubject
