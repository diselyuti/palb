import type IVariant from '@/types/IVariant'
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
import useDocument from '@/composables/useDocument'
import { ref } from 'vue'
import useAuth from '@/composables/useAuth'

const useVariant = () => {
  const { user } = useAuth()
  const { deleteDocumentsByVariantId } = useDocument()
  const variants = ref<IVariant[]>([])
  const variantsByProfessorId = ref<IVariant[]>([])
  const loadingVariants = ref<boolean>(false)
  let _unsubscribeFromVariants: Unsubscribe | null = null
  let _unsubscribeFromVariantsByProfessorId: Unsubscribe | null = null

  const getAllVariants = async (): Promise<IVariant[]> => {
    const q = query(collection(db, 'variant'))

    loadingVariants.value = true

    const querySnapshot = await getDocs(q)
    const variants: IVariant[] = []
    querySnapshot.forEach((doc) => {
      variants.push({
        id: doc.id,
        ...doc.data()
      } as IVariant)
    })
    loadingVariants.value = false

    return variants
  }

  const getVariantsByProfessorId = async (professorId: string): Promise<IVariant[]> => {
    const q = query(collection(db, 'variant'), where('professor_id', '==', professorId))

    loadingVariants.value = true

    const querySnapshot = await getDocs(q)
    const variants: IVariant[] = []
    querySnapshot.forEach((doc) => {
      variants.push({
        id: doc.id,
        ...doc.data()
      } as IVariant)
    })

    loadingVariants.value = false

    return variants
  }

  const createVariant = async (variant: IVariant | null) => {
    if (!variant) throw new Error('No variant provided')
    if (!user.value) throw new Error('No user logged in')

    loadingVariants.value = true

    variant.creator_id = user.value.uid
    await addDoc(collection(db, 'variant'), variant)

    loadingVariants.value = false
  }

  const updateVariant = async (variant: IVariant | null) => {
    if (!variant) throw new Error('No variant provided')
    if (!variant.id) throw new Error('No variant id provided')

    const variantRef = doc(db, 'variant', variant.id)

    loadingVariants.value = true

    await updateDoc(variantRef, {
      ...variant
    })

    loadingVariants.value = false
  }

  const deleteVariant = async (variant: IVariant | null) => {
    if (!variant) throw new Error('No variant provided')
    if (!variant.id) throw new Error('No variant id provided')

    loadingVariants.value = true

    await deleteDocumentsByVariantId(variant.id)
    await deleteDoc(doc(db, 'variant', variant.id))

    loadingVariants.value = false
  }

  const deleteVariantsByProfessorId = async (professorId: string) => {
    const variants = await getVariantsByProfessorId(professorId)
    const deleting = variants.map(async (variant) => {
      await deleteVariant(variant)
    })

    loadingVariants.value = true

    await Promise.all(deleting)

    loadingVariants.value = false
  }

  const subscribeToVariants = async () => {
    _unsubscribeFromVariants = onSnapshot(collection(db, 'variant'), (snapshot) => {
      variants.value = snapshot.docs.map((doc) => {
        return {
          id: doc.id,
          ...doc.data()
        } as IVariant
      })
    })
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
    })
  }

  const unsubscribeFromVariants = () => {
    if (_unsubscribeFromVariants) {
      _unsubscribeFromVariants()
      _unsubscribeFromVariants = null
    }
  }

  const unsubscribeFromVariantsByProfessorId = () => {
    if (_unsubscribeFromVariantsByProfessorId) {
      _unsubscribeFromVariantsByProfessorId()
      _unsubscribeFromVariantsByProfessorId = null
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
    loadingVariants,
    subscribeToVariants,
    subscribeToVariantsByProfessorId,
    unsubscribeFromVariants,
    unsubscribeFromVariantsByProfessorId
  }
}

export default useVariant
