import { ElevenLabsClient } from 'elevenlabs'
import { NextRequest, NextResponse } from 'next/server'

const elevenlabs = new ElevenLabsClient()

const greetingsCache: { [key: string]: Buffer | undefined } = {}

export async function POST(req: NextRequest) {
  const { message, voice } = (await req.json()) as { message: string; voice: string }

  try {
    const cacheKey = `${voice}-${message}`
    const cacheData = greetingsCache[cacheKey]

    if (cacheData) {
      return new NextResponse(cacheData, {
        headers: { 'Content-Type': 'audio/mpeg' },
      })
    } else {
      const audioStream = await elevenlabs.generate({
        voice,
        model_id: 'eleven_multilingual_v2',
        voice_settings: {
          similarity_boost: 0.1,
          stability: 0.3,
          use_speaker_boost: false,
        },
        text: message,
        optimize_streaming_latency: '2',
      })

      const audioBuffer: Buffer = await new Promise((resolve, reject) => {
        const chunks: Buffer[] = []
        audioStream.on('data', (chunk: Buffer) => chunks.push(chunk))
        audioStream.on('end', () => {
          resolve(Buffer.concat(chunks))
        })
        audioStream.on('error', reject)
      })

      greetingsCache[cacheKey] = audioBuffer

      return new NextResponse(audioBuffer, {
        headers: { 'Content-Type': 'audio/mpeg' },
      })
    }
  } catch (error) {
    console.error(error)
    return NextResponse.json(error, { status: 500 })
  }
}
