import type IDocument from '@/types/IDocument'
import {
  addDoc,
  deleteDoc,
  collection,
  getDocs,
  query,
  doc,
  updateDoc,
  where,
  onSnapshot
} from '@firebase/firestore'
import { db } from '@/firebase'
import useStorage from '@/composables/useStorage'
import { ref } from 'vue'
import type { Unsubscribe } from 'firebase/firestore'
import useAuth from '@/composables/useAuth'

const useDocument = () => {
  const { user } = useAuth()
  const { deleteFile } = useStorage()
  const documents = ref<IDocument[]>([])
  const documentsByVariantId = ref<IDocument[]>([])
  let _unsubscribeFromDocuments: Unsubscribe | null = null
  let _unsubscribeFromDocumentsByVariantId: Unsubscribe | null = null
  const loadingDocuments = ref<Boolean>(false)
  const getAllDocuments = async (): Promise<IDocument[]> => {
    loadingDocuments.value = true
    const q = query(collection(db, 'document'))
    const querySnapshot = await getDocs(q)
    const documents: IDocument[] = []
    querySnapshot.forEach((doc) => {
      documents.push({
        id: doc.id,
        ...doc.data()
      } as IDocument)
    })

    loadingDocuments.value = false
    return documents
  }

  const getDocumentsByVariantId = async (variantId: string): Promise<IDocument[]> => {
    loadingDocuments.value = true
    const q = query(collection(db, 'document'), where('variant_id', '==', variantId))
    const querySnapshot = await getDocs(q)
    const documents: IDocument[] = []
    querySnapshot.forEach((doc) => {
      documents.push({
        id: doc.id,
        ...doc.data()
      } as IDocument)
    })

    loadingDocuments.value = false
    return documents
  }
  const createDocument = async (document: IDocument | null) => {
    if (!document) throw new Error('No document provided')

    loadingDocuments.value = true

    document.creator_id = user.value.uid;
    await addDoc(collection(db, 'document'), document)

    loadingDocuments.value = false
  }

  const updateDocument = async (document: IDocument | null) => {
    if (!document) throw new Error('No document provided')
    if (!document.id) throw new Error('No document id provided')

    loadingDocuments.value = true
    const documentRef = doc(db, 'document', document.id)
    await updateDoc(documentRef, {
      ...document
    })
    loadingDocuments.value = false
  }

  const deleteDocument = async (document: IDocument | null) => {
    if (!document) throw new Error('No document provided')
    if (!document.id) throw new Error('No document id provided')

    loadingDocuments.value = true
    if (document.file) {
      try {
        await deleteFile(document.file)
      } catch (e) {
        console.log('deleteDocument: deleteFile error', e)
      }
    }

    await deleteDoc(doc(db, 'document', document.id))
    loadingDocuments.value = false
  }

  const deleteDocumentsByVariantId = async (variantId: string) => {
    loadingDocuments.value = true

    const documents = await getDocumentsByVariantId(variantId)
    const deleting = documents.map(async (document) => {
      await deleteDocument(document)
    })

    await Promise.all(deleting)
    loadingDocuments.value = false
  }

  const subscribeToDocuments = async () => {
    _unsubscribeFromDocuments = onSnapshot(collection(db, 'document'), (snapshot) => {
      documents.value = snapshot.docs.map((doc) => {
        return {
          id: doc.id,
          ...doc.data()
        } as IDocument
      })
    })
  }

  const subscribeToDocumentsByVariantId = async (variantId: string) => {
    const q = query(collection(db, 'document'), where('variant_id', '==', variantId))
    _unsubscribeFromDocumentsByVariantId = onSnapshot(q, (snapshot) => {
      documentsByVariantId.value = snapshot.docs.map((doc) => {
        return {
          id: doc.id,
          ...doc.data()
        } as IDocument
      })
    })
  }

  const unsubscribeFromDocuments = () => {
    if (_unsubscribeFromDocuments) {
      _unsubscribeFromDocuments()
      _unsubscribeFromDocuments = null
    }
  }

  const unsubscribeFromDocumentsByVariantId = () => {
    if (_unsubscribeFromDocumentsByVariantId) {
      _unsubscribeFromDocumentsByVariantId()
      _unsubscribeFromDocumentsByVariantId = null
    }
  }

  return {
    getAllDocuments,
    createDocument,
    deleteDocument,
    updateDocument,
    getDocumentsByVariantId,
    deleteDocumentsByVariantId,
    subscribeToDocuments,
    subscribeToDocumentsByVariantId,
    documents,
    documentsByVariantId,
    loadingDocuments,
    unsubscribeFromDocuments,
    unsubscribeFromDocumentsByVariantId
  }
}

export default useDocument
