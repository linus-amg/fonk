import characters from '@/api/characters'
import generateBotMessage from '@/api/generateBotMessage'
import tts from '@/api/tts'
import { NextRequest, NextResponse } from 'next/server'

interface Header {
  [key: string]: string
}

export async function POST(req: NextRequest) {
  const { message, characterId, callId } = (await req.json()) as {
    message: string
    characterId: string
    callId: string
  }

  const character = characters.find((character) => character.id === characterId)

  if (!character) {
    return new NextResponse('Character not found', { status: 404 })
  }

  try {
    const botMessage = await generateBotMessage(message, character, callId)

    if (!botMessage) {
      return new NextResponse('No message generated', { status: 404 })
    }

    const audioStream = await tts(botMessage.text, character.voice)

    const headers: Header = { 'Content-Type': 'audio/mpeg' }

    if (botMessage.language) {
      headers['Content-Language'] = botMessage.language
    }

    // @ts-expect-error - headers type is not correct
    return new NextResponse(audioStream, {
      headers,
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json(error, { status: 500 })
  }
}
