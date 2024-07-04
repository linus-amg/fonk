import { startCall } from '@/actions'
import { Character } from '@/types/Character'
import { Flex, Text } from '@chakra-ui/react'
import ReactCountryFlag from 'react-country-flag'

interface AvatarProps {
  character: Character
}

const Avatar = ({ character }: AvatarProps) => {
  const handleStartCall = () => {
    startCall(character)
  }

  return (
    <Flex
      bg="rgb(240, 239, 234)"
      p={2}
      height={48}
      rounded="md"
      backgroundImage={character.photo}
      backgroundSize="cover"
      backgroundRepeat="no-repeat"
      backgroundPosition="center"
      cursor="pointer"
      justify="space-between"
      direction="column"
      onClick={handleStartCall}
    >
      <Flex
        bg="rgba(255, 255, 255, 0.8)"
        h="24px"
        justify="center"
        align="center"
        w="24px"
        rounded="sm"
      >
        <ReactCountryFlag
          className="emojiFlag"
          countryCode={character.originCountry}
          style={{ fontSize: '1.5em' }}
          aria-label="United States"
        />
      </Flex>
      <Text
        alignSelf="flex-end"
        display="inline-block"
        p={1}
        rounded="sm"
        bg="rgba(255, 255, 255, 0.8)"
      >
        {character.name}, {character.age}
      </Text>
    </Flex>
  )
}

export default Avatar
