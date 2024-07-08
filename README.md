# FONK
Proof of concept for a phone-simulated chatbot.

<img width="292" alt="image" src="https://github.com/linus-amg/fonk/assets/7453396/717e2377-7329-4d70-9b0d-19eacdd1b6fd">
<img width="291" alt="image" src="https://github.com/linus-amg/fonk/assets/7453396/994c1237-4025-4de8-ae3c-b5bff0c4df23">

## Try it out
https://fonk-neon.vercel.app/

## Use cases
- simulate a phone call with a chatbot to
  - learn a language
  - practice phone calls
 
## Technologies used
- Claude AI to generate random characters
- ChatGPT to create avatar images for the random characters
- Next.JS for building FE+BE for the App
- Elevenlabs for text-to-speech generation

## How does it work
- when clicking on an avatar we simulate a phone call, with dialing, ringback and greeting sounds
- the user's microphone get's enabled and the transcript of the spoken text (using native speech recognition) will be sent to the backend
- if the transcript is not empty and did not change in the last 1500ms, we send the transcript to the backend
- the backend receives the transcript and generates an answer using Claude AI with some instructions around it (conversation/history starts for the call)
- the generated answer from Claude AI get's passed to Elevenlabs to generate a speech file which get's streamed to the user's client
- the client receives the speech file and plays it, usually the response from Claude AI contains an open question and the user's microphone will be enabled again so he can respond
- whenever there is a language switch in the backend (through Claude AI) we pass it in the text-to-speech response, so the client can re-initialize the microphones native speech recognition with the desired language

## How to run (you will need the API keys for the external services to run the app locally)
1. Clone the repository
2. Run `npm install`
3. Run `npm start`
4. Open a browser and go to `http://localhost:3000`
5. Click on an Avatar to start a call
6. Allow the browser access to your microphone or click on the microphone icon to respond by text message
7. Wait for a response and respond back.
8. Repeat until you don't like it anymore

## Future improvements to the code
- create easier to read and use react hooks for the request and response logic of tts + chat

# Future ideas for the project
- add a way to see the history of a call and jump back to a previous message and continue from there
- predict the next answers based on the current message and pre-generate voice messages for them so the conversation can be more fluid (already generate answers while still waiting for response)
- add a way to add custom voice messages for the bot
- re-generate avatars with random details for each
