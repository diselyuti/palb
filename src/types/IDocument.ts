import type IFile from '@/types/IFile'

export default interface IDocument {
  title: string
  variant_id: string
  file: IFile | null
  id?: string
}
