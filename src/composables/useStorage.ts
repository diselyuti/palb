import { uploadBytes, ref, getDownloadURL, deleteObject } from '@firebase/storage'
import { v4 as uuidv4 } from 'uuid'
import type IFile from '@/types/IFile'
import { storage } from '@/firebase'

const useStorage = () => {
  const uploadFile = async (file: File | null): Promise<IFile> => {
    if (!file) throw new Error('No file provided')

    const storageRef = ref(storage, uuidv4())
    await uploadBytes(storageRef, file)
    const downloadUrl = await getDownloadURL(storageRef)
    return {
      filename: file.name,
      download_url: downloadUrl,
      storage_path: storageRef.fullPath
    }
  }

  const deleteFile = async (file: IFile | null): Promise<void> => {
    if (!file) throw new Error('No file provided')

    const storageRef = ref(storage, file.storage_path)
    await deleteObject(storageRef)
  }

  return { uploadFile, deleteFile }
}

export default useStorage
