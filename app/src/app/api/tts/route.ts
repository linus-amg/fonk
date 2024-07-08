import tts from '@/api/tts'
import { NextRequest, NextResponse } from 'next/server'

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
      const audioStream = await tts(message, voice)

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
