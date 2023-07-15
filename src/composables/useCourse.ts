import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  query,
  updateDoc
} from '@firebase/firestore'
import type { Unsubscribe } from 'firebase/firestore'
import { db } from '@/firebase'
import { ref } from 'vue'
import type ICourse from '@/types/ICourse'
import useSubject from '@/composables/useSubject'
import useAuth from '@/composables/useAuth'

const useCourse = () => {
  const { deleteSubjectsByCourseId } = useSubject()
  const { user } = useAuth()
  const courses = ref<ICourse[]>([])
  const loadingCourses = ref<boolean>(false)
  let unsubscribe: Unsubscribe | null = null

  const getAllCourses = async (): Promise<ICourse[]> => {
    const q = query(collection(db, 'course'))

    loadingCourses.value = true

    const querySnapshot = await getDocs(q)
    const courses: ICourse[] = []
    querySnapshot.forEach((doc) => {
      courses.push({
        id: doc.id,
        ...doc.data()
      } as ICourse)
    })

    loadingCourses.value = false

    return courses
  }

  const createCourse = async (course: ICourse | null) => {
    if (!course) throw new Error('No course provided')
    if (!user.value) throw new Error('No user provided')

    loadingCourses.value = true

    course.creator_id = user.value.uid
    await addDoc(collection(db, 'course'), course)

    loadingCourses.value = false
  }

  const updateCourse = async (course: ICourse | null) => {
    if (!course) throw new Error('No course provided')
    if (!course.id) throw new Error('No course id provided')

    const courseRef = doc(db, 'course', course.id)

    loadingCourses.value = true

    await updateDoc(courseRef, {
      ...course
    })

    loadingCourses.value = false
  }

  const deleteCourse = async (course: ICourse | null) => {
    if (!course) throw new Error('No course provided')
    if (!course.id) throw new Error('No course id provided')

    loadingCourses.value = true

    await deleteSubjectsByCourseId(course.id)
    await deleteDoc(doc(db, 'course', course.id))

    loadingCourses.value = false
  }

  const subscribeToCourses = async () => {
    unsubscribe = onSnapshot(collection(db, 'course'), (snapshot) => {
      courses.value = snapshot.docs.map((doc) => {
        return {
          id: doc.id,
          ...doc.data()
        } as ICourse
      })
    })
  }

  const unsubscribeFromCourses = () => {
    if (unsubscribe) {
      unsubscribe()
      unsubscribe = null
    }
  }

  return {
    createCourse,
    updateCourse,
    deleteCourse,
    getAllCourses,
    courses,
    loadingCourses,
    subscribeToCourses,
    unsubscribeFromCourses
  }
}

export default useCourse
