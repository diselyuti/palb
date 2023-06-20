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
import type IProfessor from "@/types/IProfessor";
import useVariant from "@/composables/useVariant";

const useProfessor = () => {
	const { deleteVariantsByProfessorId } = useVariant();
	const professors = ref<IProfessor[]>([]);
	const professorsBySubjectId = ref<IProfessor[]>([]);
	let _unsubscribeFromProfessors: Unsubscribe | null = null;
	let _unsubscribeFromProfessorsBySubjectId: Unsubscribe | null = null;

	const getAllProfessors = async (): Promise<IProfessor[]> => {
		const q = query(collection(db, 'professor'))
		const querySnapshot = await getDocs(q)
		const professors: IProfessor[] = []
		querySnapshot.forEach((doc) => {
			professors.push({
				id: doc.id,
				...doc.data()
			} as IProfessor)
		})

		return professors
	}

	const getProfessorsBySubjectId = async (subjectId: string): Promise<IProfessor[]> => {
		const q = query(collection(db, 'professor'), where('subject_id', '==', subjectId))
		const querySnapshot = await getDocs(q)
		const professors: IProfessor[] = []
		querySnapshot.forEach((doc) => {
			professors.push({
				id: doc.id,
				...doc.data()
			} as IProfessor)
		})

		return professors
	}

	const createProfessor = async (professor: IProfessor | null) => {
		if (!professor) throw new Error('No professor provided')

		await addDoc(collection(db, 'professor'), professor)
	}

	const updateProfessor = async (professor: IProfessor | null) => {
		if (!professor) throw new Error('No professor provided')
		if (!professor.id) throw new Error('No professor id provided')

		const professorRef = doc(db, 'professor', professor.id)
		await updateDoc(professorRef, {
			...professor
		})
	}

	const deleteProfessor = async (professor: IProfessor | null) => {
		if (!professor) throw new Error('No professor provided')
		if (!professor.id) throw new Error('No professor id provided')

		await deleteVariantsByProfessorId(professor.id);
		await deleteDoc(doc(db, 'professor', professor.id))
	}

	const deleteProfessorsBySubjectId = async (subjectId: string) => {
		const professors = await getProfessorsBySubjectId(subjectId)
		const deleting = professors.map(async (professor) => {
			await deleteProfessor(professor)
		})

		await Promise.all(deleting)
	}

	const subscribeToProfessors = async () => {
		_unsubscribeFromProfessors = onSnapshot(collection(db, 'professor'), (snapshot) => {
			professors.value = snapshot.docs.map((doc) => {
				return {
					id: doc.id,
					...doc.data()
				} as IProfessor
			})
		});
	}

	const subscribeToProfessorsBySubjectId = async (subjectId: string) => {
		const q = query(collection(db, 'professor'), where('subject_id', '==', subjectId));
		_unsubscribeFromProfessorsBySubjectId = onSnapshot(q, (snapshot) => {
			professorsBySubjectId.value = snapshot.docs.map((doc) => {
				return {
					id: doc.id,
					...doc.data()
				} as IProfessor
			})
		});
	}

	const unsubscribeFromProfessors = () => {
		if (_unsubscribeFromProfessors) {
			_unsubscribeFromProfessors();
			_unsubscribeFromProfessors = null;
		}
	}

	const unsubscribeFromProfessorsBySubjectId = () => {
		if (_unsubscribeFromProfessorsBySubjectId) {
			_unsubscribeFromProfessorsBySubjectId();
			_unsubscribeFromProfessorsBySubjectId = null;
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
		subscribeToProfessors,
		subscribeToProfessorsBySubjectId,
		unsubscribeFromProfessors,
		unsubscribeFromProfessorsBySubjectId,
	}
}

export default useProfessor
