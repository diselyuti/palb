import {
	addDoc,
	collection,
	deleteDoc,
	doc,
	getDocs,
	onSnapshot,
	query,
	updateDoc, where
} from '@firebase/firestore'
import type { Unsubscribe } from 'firebase/firestore'
import { db } from '@/firebase'
import {ref} from "vue";
import type ICourse from "@/types/ICourse";
import useSubject from "@/composables/useSubject";

const useCourse = () => {
	const { deleteSubjectsByCourseId } = useSubject();
	const courses = ref<ICourse[]>([]);
	let unsubscribe: Unsubscribe | null = null;

	const getAllCourses = async (): Promise<ICourse[]> => {
		const q = query(collection(db, 'course'))
		const querySnapshot = await getDocs(q)
		const courses: ICourse[] = []
		querySnapshot.forEach((doc) => {
			courses.push({
				id: doc.id,
				...doc.data()
			} as ICourse)
		})

		return courses
	}

	const createCourse = async (course: ICourse | null) => {
		if (!course) throw new Error('No course provided')

		await addDoc(collection(db, 'course'), course)
	}

	const updateCourse = async (course: ICourse | null) => {
		if (!course) throw new Error('No course provided')
		if (!course.id) throw new Error('No course id provided')

		const courseRef = doc(db, 'course', course.id)
		await updateDoc(courseRef, {
			...course
		})
	}

	const deleteCourse = async (course: ICourse | null) => {
		if (!course) throw new Error('No course provided')
		if (!course.id) throw new Error('No course id provided')

		await deleteSubjectsByCourseId(course.id);
		await deleteDoc(doc(db, 'course', course.id))
	}

	const subscribeToCourses = async () => {
		unsubscribe = onSnapshot(collection(db, 'course'), (snapshot) => {
			courses.value = snapshot.docs.map((doc) => {
				return {
					id: doc.id,
					...doc.data()
				} as ICourse
			})
		});
	}

	const unsubscribeFromCourses = () => {
		if (unsubscribe) {
			unsubscribe();
			unsubscribe = null;
		}
	}

	return {
		createCourse,
		updateCourse,
		deleteCourse,
		getAllCourses,
		courses,
		subscribeToCourses,
		unsubscribeFromCourses,
	}
}

export default useCourse
