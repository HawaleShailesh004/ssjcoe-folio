import { createSupabaseBrowserClient } from '@/lib/supabase-browser'

export type StorageBucket = 'placements' | 'research' | 'patents' | 'events' | 'achievements' | 'faculty' | 'avatars'

export async function uploadFile(
  bucket: StorageBucket,
  entityId: string,
  file: File,
  fileName: string
): Promise<string | null> {
  const supabase = createSupabaseBrowserClient()
  const ext = file.name.split('.').pop()
  const path = `${entityId}/${fileName}.${ext}`

  const { error } = await supabase.storage.from(bucket).upload(path, file, { upsert: true })
  if (error) { console.error('Upload error:', error); return null }

  const { data } = supabase.storage.from(bucket).getPublicUrl(path)
  return data.publicUrl
}

export async function deleteFile(bucket: StorageBucket, entityId: string, fileName: string): Promise<void> {
  const supabase = createSupabaseBrowserClient()
  const { data: list } = await supabase.storage.from(bucket).list(entityId)
  if (!list) return
  const match = list.find(f => f.name.startsWith(fileName))
  if (match) await supabase.storage.from(bucket).remove([`${entityId}/${match.name}`])
}
