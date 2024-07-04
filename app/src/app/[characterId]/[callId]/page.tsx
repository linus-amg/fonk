'use client'

import characters from '@/api/characters'

import { Box, Flex, HStack, Img, Text, VStack } from '@chakra-ui/react'
import { MicrophoneIcon, PhoneIcon } from '@heroicons/react/24/solid'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useSound } from 'use-sound'

import dynamic from 'next/dynamic'

const CallModuleWithNoSSR = dynamic(() => import('@/components/CallModule'), { ssr: false })

type CallProps = {
  params: {
    characterId: string
    callId: string
  }
}

const statusLabel: { [key: number]: string } = {
  0: 'Dialing',
  1: 'Calling',
  2: 'Connected',
}

const SPEAKER_BOT = 'bot'
const SPEKAER_USER = 'user'

export default function Call({ params }: CallProps) {
  const [speaker, setSpeaker] = useState(SPEAKER_BOT)
  const router = useRouter()
  const { characterId, callId } = params

  const character = characters.find((character) => character.id === characterId)

  // time between 10 and 30 seconds
  const randomPickupTime = Math.floor(Math.random() * 10000) + 8000

  const [playHangUp] = useSound('/audio/hangup.mp3')
  const [playRingBack, { stop: stopRingBack }] = useSound('/audio/ringback2.mp3')
  const [playDialTone] = useSound('/audio/dialtone.mp3')
  const [status, setStatus] = useState(0)

  useEffect(() => {
    playDialTone()
    const interval = setInterval(() => {
      playRingBack()
    }, 5000)

    const callingStatusTimeout = setTimeout(() => {
      setStatus(1)
    }, 3000)

    const pickupTimeout = setTimeout(() => {
      setStatus(2)
      clearInterval(interval)
      stopRingBack()
    }, randomPickupTime)

    return () => {
      clearInterval(interval)
      clearTimeout(pickupTimeout)
      clearTimeout(callingStatusTimeout)
      stopRingBack()
    }
  }, [playRingBack, playDialTone])

  const goBack = () => {
    playHangUp()
    router.push('/')
  }

  const handleSpeakerChange = (speaker: string) => {
    setSpeaker(speaker)
  }

  if (!character) {
    return null
  }

  return (
    <VStack width="400px">
      <CallModuleWithNoSSR
        character={character}
        callId={callId}
        status={status}
        onEnd={goBack}
        onSpeakerChange={handleSpeakerChange}
      >
        {({ handleTextInsteadOfSpeech }: { handleTextInsteadOfSpeech: () => void }) => (
          <Flex
            bg="rgb(240, 239, 234)"
            justify="space-evenly"
            p={8}
            h="720px"
            w="full"
            rounded="16px"
            align="center"
            direction="column"
          >
            <Text
              color="rgb(60, 59, 54)"
              fontWeight="bold"
              fontSize={22}
            >
              {statusLabel[status]} {status <= 1 && `...`}
            </Text>

            <Img
              rounded="full"
              width={64}
              src={character.photo}
              alt={character.name}
            />
            <VStack spacing={12}>
              <Text
                color="rgb(60, 59, 54)"
                fontWeight="bold"
                fontSize={22}
              >
                {character.name}
              </Text>

              <HStack spacing={132}>
                <Box
                  color={speaker === SPEKAER_USER ? 'green.500' : 'gray.300'}
                  as={MicrophoneIcon}
                  width={8}
                  cursor="pointer"
                  onClick={handleTextInsteadOfSpeech}
                ></Box>
                <Box
                  as={PhoneIcon}
                  width={8}
                  color={status === 0 ? 'gray.300' : 'red.400'}
                  _hover={{ color: status === 0 ? 'gray.300' : 'red.500' }}
                  cursor="pointer"
                  onClick={goBack}
                />
              </HStack>
            </VStack>
          </Flex>
        )}
      </CallModuleWithNoSSR>
    </VStack>
  )
}
