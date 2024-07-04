import generateBotMessage from '@/api/generateBotMessage'
import characters from '@/api/characters'
import { ElevenLabsClient } from 'elevenlabs'
import { NextRequest, NextResponse } from 'next/server'

const elevenlabs = new ElevenLabsClient()

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

    const audioStream = await elevenlabs.generate({
      voice: character.voice,
      model_id: 'eleven_multilingual_v2',
      voice_settings: {
        similarity_boost: 0.1,
        style: 0,
        stability: 0.3,
        use_speaker_boost: false,
      },
      text: botMessage.text,
      optimize_streaming_latency: '2',
    })

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
