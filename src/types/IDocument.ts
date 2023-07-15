import type IFile from '@/types/IFile'

export default interface IDocument {
  title: string
  variant_id: string
  file: IFile | null
  creator_id: string
  id?: string
}
