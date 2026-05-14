'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { CreateGameRecordInput, GameRecord } from '@/lib/types'

export async function getRecords(): Promise<GameRecord[]> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data } = await supabase
    .from('game_records')
    .select('*')
    .eq('user_id', user.id)
    .order('game_date', { ascending: false })

  return data ?? []
}

export async function getRecordById(id: string): Promise<GameRecord | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data } = await supabase
    .from('game_records')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  return data
}

export async function createRecord(input: CreateGameRecordInput) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: '로그인이 필요합니다.' }

  const { error } = await supabase
    .from('game_records')
    .insert({ ...input, user_id: user.id })

  if (error) return { error: error.message }

  revalidatePath('/records')
  redirect('/records')
}

export async function updateRecord(id: string, input: Partial<CreateGameRecordInput>) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: '로그인이 필요합니다.' }

  const { error } = await supabase
    .from('game_records')
    .update(input)
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) return { error: error.message }

  revalidatePath('/records')
  revalidatePath(`/records/${id}`)
  redirect(`/records/${id}`)
}

export async function deleteRecord(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: '로그인이 필요합니다.' }

  const { error } = await supabase
    .from('game_records')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) return { error: error.message }

  revalidatePath('/records')
  redirect('/records')
}
