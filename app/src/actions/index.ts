'use server'

import { Character } from '@/types/Character'
import { redirect } from 'next/navigation'
import { v4 } from 'uuid'

export const startCall = (character: Character) => {
  const callId = v4()
  return redirect(`/${character.id}/${callId}`)
}
