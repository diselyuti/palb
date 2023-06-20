import type IVariant from '@/types/IVariant'
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
import useDocument from "@/composables/useDocument";
import {ref} from "vue";

const useVariant = () => {
  const { deleteDocumentsByVariantId } = useDocument()
  const variants = ref<IVariant[]>([]);
  const variantsByProfessorId = ref<IVariant[]>([]);
  let _unsubscribeFromVariants: Unsubscribe | null = null;
  let _unsubscribeFromVariantsByProfessorId: Unsubscribe | null = null;

  const getAllVariants = async (): Promise<IVariant[]> => {
    const q = query(collection(db, 'variant'))
    const querySnapshot = await getDocs(q)
    const variants: IVariant[] = []
    querySnapshot.forEach((doc) => {
      variants.push({
        id: doc.id,
        ...doc.data()
      } as IVariant)
    })

    return variants
  }

  const getVariantsByProfessorId = async (professorId: string): Promise<IVariant[]> => {
    const q = query(collection(db, 'variant'), where('professor_id', '==', professorId))
    const querySnapshot = await getDocs(q)
    const variants: IVariant[] = []
    querySnapshot.forEach((doc) => {
      variants.push({
        id: doc.id,
        ...doc.data()
      } as IVariant)
    })

    return variants
  }

  const createVariant = async (variant: IVariant | null) => {
    if (!variant) throw new Error('No variant provided')

    await addDoc(collection(db, 'variant'), variant)
  }

  const updateVariant = async (variant: IVariant | null) => {
    if (!variant) throw new Error('No variant provided')
    if (!variant.id) throw new Error('No variant id provided')

    const variantRef = doc(db, 'variant', variant.id)
    await updateDoc(variantRef, {
      ...variant
    })
  }

  const deleteVariant = async (variant: IVariant | null) => {
    if (!variant) throw new Error('No variant provided')
    if (!variant.id) throw new Error('No variant id provided')
    await deleteDocumentsByVariantId(variant.id)
    await deleteDoc(doc(db, 'variant', variant.id))
  }

  const deleteVariantsByProfessorId = async (professorId: string) => {
    const variants = await getVariantsByProfessorId(professorId)
    const deleting = variants.map(async (variant) => {
      await deleteVariant(variant)
    })

    await Promise.all(deleting)
  }

  const subscribeToVariants = async () => {
    _unsubscribeFromVariants = onSnapshot(collection(db, 'variant'), (snapshot) => {
      variants.value = snapshot.docs.map((doc) => {
        return {
          id: doc.id,
          ...doc.data()
        } as IVariant
      })
    });
  }

  const subscribeToVariantsByProfessorId = async (professorId: string) => {
    const q = query(collection(db, 'variant'), where('professor_id', '==', professorId))
    _unsubscribeFromVariantsByProfessorId = onSnapshot(q, (snapshot) => {
      variantsByProfessorId.value = snapshot.docs.map((doc) => {
        return {
          id: doc.id,
          ...doc.data()
        } as IVariant
      })
    });
  }

  const unsubscribeFromVariants = () => {
    if (_unsubscribeFromVariants) {
      _unsubscribeFromVariants();
      _unsubscribeFromVariants = null;
    }
  }

  const unsubscribeFromVariantsByProfessorId = () => {
    if (_unsubscribeFromVariantsByProfessorId) {
      _unsubscribeFromVariantsByProfessorId();
      _unsubscribeFromVariantsByProfessorId = null;
    }
  }

  return {
    createVariant,
    updateVariant,
    deleteVariant,
    deleteVariantsByProfessorId,
    getAllVariants,
    getVariantsByProfessorId,
    variants,
    variantsByProfessorId,
    subscribeToVariants,
    subscribeToVariantsByProfessorId,
    unsubscribeFromVariants,
    unsubscribeFromVariantsByProfessorId,
  }
}

export default useVariant
