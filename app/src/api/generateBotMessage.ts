import { Character } from '@/types/Character'
import Anthropic from '@anthropic-ai/sdk'
import { ContentBlock, Message, TextBlock } from '@anthropic-ai/sdk/resources/messages.mjs'

const anthropic = new Anthropic()

interface InternalMessage {
  role: string
  content: {
    type: string
    text: string
  }[]
}

interface MessageHistory {
  [key: string]: Array<InternalMessage>
}

const messageHistory: MessageHistory = {}

const generateBotMessage = async (
  userMessage: string,
  character: Character,
  callId: string
): Promise<{ language?: string; text: string } | undefined> => {
  const messageHistoryByCall = messageHistory[callId] ?? []

  console.log('history length for this call', messageHistoryByCall.length)

  if (messageHistoryByCall.length === 0) {
    messageHistory[callId] = messageHistoryByCall
    messageHistoryByCall.push({
      role: 'user',
      content: [
        {
          type: 'text',
          text: `Conversation with user Template:
              Topic: Greet by the name you deducted of "${userMessage}" and ask for a topic to talk about
              Language: ${character.nativeLanguage}
              Speaker style: neutral
              Detail: Give short answers, like a quick conversation.
              Converse like you are the following person: ${JSON.stringify(character)}

              Instructions:
              1. Conduct the entire conversation in the specified language.
              2. Begin a conversation about the given topic.
              3. Maintain a natural, conversational tone throughout.
              4. Adapt any cultural references or idioms to be appropriate for the specified language and associated culture(s).
              5. Try to use less "based on the previous answer" or "as you mentioned before" in responses to make the conversation more engaging.
              6. Whenever there is a switch in language, please declare it (In a <language> tag.) use the following format: <language> [Language] </language> where for german for example it would be de-DE or for mexican spanish es-MX etc.
              7. Correct any mistakes in the user's language, but do not correct the user's grammar or spelling.

              Please begin the conversation based on these instructions, using the specified language.
            `,
        },
      ],
    })
  } else {
    messageHistoryByCall.push({
      role: 'user',
      content: [
        {
          type: 'text',
          text: userMessage,
        },
      ],
    })
  }

  try {
    const message: Message = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 2048,
      temperature: 0,
      messages: messageHistoryByCall as Message[],
    })

    const contents: ContentBlock[] = message.content
    const content: ContentBlock = contents[0] as TextBlock

    messageHistoryByCall.push({
      role: 'assistant',
      content: [
        {
          type: 'text',
          text: content.text,
        },
      ],
    })

    // get the language of the response, <language> [Language] </language>
    const language = content.text.match(/<language>(.*?)<\/language>/)?.[1]

    // if the response has a language tag, remove it
    if (language) {
      content.text = content.text.replace(/<language>(.*?)<\/language>/, '')
    }

    return { language, text: content.text }
  } catch (error: unknown) {
    console.log(JSON.stringify(messageHistory, null, 2))

    console.error(error)
    return
  }
}

export default generateBotMessage
