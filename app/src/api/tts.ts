import { ElevenLabsClient } from 'elevenlabs'

const elevenlabs = new ElevenLabsClient()

const tts = (text: string, voice: string) => {
  return elevenlabs.generate({
    voice,
    model_id: 'eleven_multilingual_v2',
    voice_settings: {
      similarity_boost: 0.3,
      stability: 0.5,
      use_speaker_boost: true,
    },
    text,
    optimize_streaming_latency: '2',
  })
}

export default tts
