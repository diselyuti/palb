import type IVariant from '@/types/IVariant'
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
import useDocument from "@/composables/useDocument";
import {ref} from "vue";

const useVariant = () => {
  const { deleteDocumentsByVariantId } = useDocument()
  const variants = ref<IVariant[]>([]);
  let unsubscribe: Unsubscribe | null = null;

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

  const subscribeToVariants = async () => {
    unsubscribe = onSnapshot(collection(db, 'variant'), (snapshot) => {
      variants.value = snapshot.docs.map((doc) => {
        return {
          id: doc.id,
          ...doc.data()
        } as IVariant
      })
    });
  }

  const unsubscribeFromVariants = () => {
    if (unsubscribe) {
      unsubscribe();
      unsubscribe = null;
    }
  }

  return {
    createVariant,
    updateVariant,
    deleteVariant,
    getAllVariants,
    variants,
    subscribeToVariants,
    unsubscribeFromVariants,
  }
}

export default useVariant
