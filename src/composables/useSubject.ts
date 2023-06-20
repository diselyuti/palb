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
import useProfessor from "@/composables/useProfessor";
import type ISubject from "@/types/ISubject";

const useSubject = () => {
	const { deleteProfessorsBySubjectId } = useProfessor();
	const subjects = ref<ISubject[]>([]);
	const subjectsByCourseId = ref<ISubject[]>([]);
	let _unsubscribeFromSubjects: Unsubscribe | null = null;
	let _unsubscribeFromSubjectsByCourseId: Unsubscribe | null = null;

	const getAllSubjects = async (): Promise<ISubject[]> => {
		const q = query(collection(db, 'subject'))
		const querySnapshot = await getDocs(q)
		const subjects: ISubject[] = []
		querySnapshot.forEach((doc) => {
			subjects.push({
				id: doc.id,
				...doc.data()
			} as ISubject)
		})

		return subjects
	}

	const getSubjectsByCourseId = async (courseId: string): Promise<ISubject[]> => {
		const q = query(collection(db, 'subject'), where('course_id', '==', courseId))
		const querySnapshot = await getDocs(q)
		const subjects: ISubject[] = []
		querySnapshot.forEach((doc) => {
			subjects.push({
				id: doc.id,
				...doc.data()
			} as ISubject)
		})

		return subjects
	}

	const createSubject = async (subject: ISubject | null) => {
		if (!subject) throw new Error('No subject provided')

		await addDoc(collection(db, 'subject'), subject)
	}

	const updateSubject = async (subject: ISubject | null) => {
		if (!subject) throw new Error('No subject provided')
		if (!subject.id) throw new Error('No subject id provided')

		const subjectRef = doc(db, 'subject', subject.id)
		await updateDoc(subjectRef, {
			...subject
		})
	}

	const deleteSubject = async (subject: ISubject | null) => {
		if (!subject) throw new Error('No subject provided')
		if (!subject.id) throw new Error('No subject id provided')

		await deleteProfessorsBySubjectId(subject.id);
		await deleteDoc(doc(db, 'subject', subject.id))
	}

	const deleteSubjectsByCourseId = async (courseId: string) => {
		const subjects = await getSubjectsByCourseId(courseId)
		const deleting = subjects.map(async (subject) => {
			await deleteSubject(subject)
		})

		await Promise.all(deleting)
	}

	const subscribeToSubjects = async () => {
		_unsubscribeFromSubjects = onSnapshot(collection(db, 'subject'), (snapshot) => {
			subjects.value = snapshot.docs.map((doc) => {
				return {
					id: doc.id,
					...doc.data()
				} as ISubject
			})
		});
	}

	const subscribeToSubjectsByCourseId = async (courseId: string) => {
		const q = query(collection(db, 'subject'), where('course_id', '==', courseId));
		_unsubscribeFromSubjectsByCourseId = onSnapshot(q, (snapshot) => {
			subjectsByCourseId.value = snapshot.docs.map((doc) => {
				return {
					id: doc.id,
					...doc.data()
				} as ISubject
			})
		});
	}

	const unsubscribeFromSubjects = () => {
		if (_unsubscribeFromSubjects) {
			_unsubscribeFromSubjects();
			_unsubscribeFromSubjects = null;
		}
	}

	const unsubscribeFromSubjectsByCourseId = () => {
		if (_unsubscribeFromSubjectsByCourseId) {
			_unsubscribeFromSubjectsByCourseId();
			_unsubscribeFromSubjectsByCourseId = null;
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
		subscribeToSubjects,
		subscribeToSubjectsByCourseId,
		unsubscribeFromSubjects,
		unsubscribeFromSubjectsByCourseId,
	}
}

export default useSubject
