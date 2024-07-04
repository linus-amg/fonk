/* eslint-disable @typescript-eslint/no-misused-promises */
'use client'

import characters from '@/api/characters'
import Avatar from '@/components/Avatar'
import { Flex, SimpleGrid, Text, VStack } from '@chakra-ui/react'

export default function Home() {
  return (
    <VStack width="400px">
      <Flex
        bg="rgb(240, 239, 234)"
        justify="center"
        p={8}
        h={24}
        w="full"
        rounded="md"
      >
        <Text
          color="rgb(60, 59, 54)"
          fontWeight="bold"
          fontSize={22}
        >
          Who you gonna call?
        </Text>
      </Flex>

      <SimpleGrid
        columns={2}
        spacing={4}
        w="full"
        pt={2}
        gridTemplateColumns="1fr 1fr"
      >
        {characters.map((character, index) => (
          <Avatar
            key={index}
            character={character}
          />
        ))}
      </SimpleGrid>
    </VStack>
  )
}
