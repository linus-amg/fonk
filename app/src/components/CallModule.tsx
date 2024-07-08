'use client'

import 'regenerator-runtime/runtime'

import { Character } from '@/types/Character'
import { Field, FieldValues, FormLayout, useModals } from '@saas-ui/react'
import { useEffect, useMemo, useRef, useState } from 'react'
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'

interface CallModuleProps {
  character: Character
  callId: string
  status: number
  onEnd: () => void
  onSpeakerChange: (speaker: string) => void
  children: (props: { handleTextInsteadOfSpeech: () => void }) => JSX.Element
}

const endIngs: { [key: string]: string } = {
  'es-MX': 'adiós',
  'de-DE': 'tschüss',
  'es-ES': 'adiós',
  'en-US': 'goodbye',
  'fi-FI': 'hei hei',
  'hi-IN': 'अलविदा',
}

const CallModule = ({ character, status, onEnd, onSpeakerChange, callId, children }: CallModuleProps) => {
  const [inputLanguage, setInputLanguage] = useState(character.nativeLanguage)
  const audioRef = useRef<HTMLAudioElement>(new Audio())

  useEffect(() => {
    const fn = async () => {
      const botVoiceResponse = await fetch('/api/tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: character.greeting,
          callId: callId,
          voice: character.voice,
        }),
      }).then((response) => response.blob())

      const reader = new FileReader()
      reader.readAsDataURL(botVoiceResponse)
      reader.onload = () => {
        audioRef.current.src = reader.result as string
      }
    }

    fn()
      .then(() => {})
      .catch((error: unknown) => {
        console.error(error)
      })
  }, [character.greeting, character.voice, callId])

  const handleOnEnded = useMemo(() => {
    return () => {
      onSpeakerChange('user')
      SpeechRecognition.startListening({
        continuous: true,
        language: inputLanguage,
      })
        .then(() => {})
        .catch((error: unknown) => {
          console.error(error)
        })

      return
    }
  }, [inputLanguage])

  useEffect(() => {
    const current = audioRef.current
    current.addEventListener('ended', handleOnEnded)

    return () => {
      current.removeEventListener('ended', handleOnEnded)
    }
  }, [handleOnEnded, inputLanguage])

  const sendResponse = async (message: string) => {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        characterId: character.id,
        callId,
        message,
      }),
    })

    const responseBlob = await response.blob()

    const switchedLanguage = response.headers.get('Content-Language')

    if (switchedLanguage) {
      setInputLanguage(switchedLanguage)
    }

    const reader = new FileReader()
    reader.readAsDataURL(responseBlob)
    reader.onload = async () => {
      onSpeakerChange('bot')
      audioRef.current.src = reader.result as string
      await audioRef.current.play()
    }
  }

  const { transcript, resetTranscript } = useSpeechRecognition()

  useEffect(() => {
    if (status === 2) {
      onSpeakerChange('bot')
      audioRef.current
        .play()
        .then(() => {})
        .catch((error: unknown) => {
          console.error(error)
        })
    }

    return () => {
      SpeechRecognition.stopListening()
        .then(() => {})
        .catch((error: unknown) => {
          console.error(error)
        })
      resetTranscript()
    }
  }, [status, resetTranscript])

  useEffect(() => {
    const delay = 1500

    const resetTimer = setTimeout(() => {
      if (transcript) {
        onSpeakerChange('bot')
        SpeechRecognition.stopListening()
          .then(() => {})
          .catch((error: unknown) => {
            console.error(error)
          })

        if (transcript === endIngs[character.nativeLanguage]) {
          onEnd()
        } else {
          sendResponse(transcript)
            .then(() => {
              console.log('SENT', transcript)
            })
            .catch((error: unknown) => {
              console.error(error)
            })
        }

        resetTranscript()
      }
    }, delay)

    return () => {
      clearTimeout(resetTimer)
    }
  }, [transcript, resetTranscript])

  const modals = useModals()

  const handleTextInsteadOfSpeech = () => {
    const modal = modals.open({
      title: 'Type your message',
      motionPreset: 'slideInBottom',
      type: 'form',

      onSubmit: async (data: FieldValues) => {
        onSpeakerChange('bot')
        modals.close(modal)

        await SpeechRecognition.stopListening()

        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        await sendResponse(data.message)
      },
      children: (
        <FormLayout>
          <Field
            autoFocus
            type="text"
            name="message"
            label="Message"
            isRequired
            placeholder="Type your message here"
          />
        </FormLayout>
      ),
    })
  }

  return (
    <>
      <audio ref={audioRef} />
      {children({ handleTextInsteadOfSpeech })}
      {/* {statusLabel[status]} */}
      {/* <p>Microphone: {listening ? 'on' : 'off'}</p> */}
      {/* <p>{transcript}</p> */}
    </>
  )
}

export default CallModule
