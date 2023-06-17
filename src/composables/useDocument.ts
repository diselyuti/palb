import type IDocument from '@/types/IDocument'
import {addDoc, deleteDoc, collection, getDocs, query, doc, updateDoc, where, onSnapshot} from '@firebase/firestore'
import { db } from '@/firebase'
import useStorage from '@/composables/useStorage'
import {ref} from "vue";
import type {Unsubscribe} from "firebase/firestore";

const useDocument = () => {
  const { deleteFile } = useStorage();
  const documents = ref<IDocument[]>([]);
  let unsubscribe: Unsubscribe | null = null;
  const getAllDocuments = async (): Promise<IDocument[]> => {
    const q = query(collection(db, 'document'))
    const querySnapshot = await getDocs(q)
    const documents: IDocument[] = []
    querySnapshot.forEach((doc) => {
      documents.push({
        id: doc.id,
        ...doc.data()
      } as IDocument)
    })

    return documents
  }

  const getDocumentsByVariantId = async (variantId: string): Promise<IDocument[]> => {
    const q = query(collection(db, 'document'), where('variant_id', '==', variantId))
    const querySnapshot = await getDocs(q)
    const documents: IDocument[] = []
    querySnapshot.forEach((doc) => {
      documents.push({
        id: doc.id,
        ...doc.data()
      } as IDocument)
    })

    return documents
  }
  const createDocument = async (document: IDocument | null) => {
    if (!document) throw new Error('No document provided')

    await addDoc(collection(db, 'document'), document)
  }

  const updateDocument = async (document: IDocument | null) => {
    if (!document) throw new Error('No document provided')
    if (!document.id) throw new Error('No document id provided')

    const documentRef = doc(db, 'document', document.id)
    await updateDoc(documentRef, {
      ...document
    })
  }

  const deleteDocument = async (document: IDocument | null) => {
    if (!document) throw new Error('No document provided')
    if (!document.id) throw new Error('No document id provided')

    if (document.file) {
      try {
        await deleteFile(document.file)
      } catch (e) {
        console.log('deleteDocument: deleteFile error', e)
      }
    }

    await deleteDoc(doc(db, 'document', document.id))
  }

  const deleteDocumentsByVariantId = async (variantId: string) => {
    const documents = await getDocumentsByVariantId(variantId);
    const deleting = documents.map(async (document) => {
      await deleteDocument(document);
    })

    await Promise.all(deleting);
  }

  const subscribeToDocuments = async () => {
    unsubscribe = onSnapshot(collection(db, 'document'), (snapshot) => {
      documents.value = snapshot.docs.map((doc) => {
        return {
          id: doc.id,
          ...doc.data()
        } as IDocument
      })
    })
  }

  const unsubscribeFromDocuments = () => {
    if (unsubscribe) {
      unsubscribe();
      unsubscribe = null;
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
    documents,
    unsubscribeFromDocuments,
  }
}

export default useDocument
