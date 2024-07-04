- Name: [First Name] [Surname]
- Age: [Number between 10 and 100, with higher probability between 20 and 50]
- Voice: [One of: ${maleVoices.join(', ')} for males or ${femaleVoices.join(', ')} for females]
- Origin country: [Country name]
- Native language: [One of: de-DE, en-US, es-MX]
- Other languages: 
  - [Language 1]: [Proficiency level: A1, A2, B1, B2, or C1]
  - [Language 2 (optional)]: [Proficiency level: A1, A2, B1, B2, or C1]
- Religion: [Real-world religion or belief system]
- Facial assets: [Description of hair, eyes, nose, mouth, and accessories]
- Personality: [Description of personality traits]
- Professional occupation: [Description of job or occupation] (could also be student, retired, etc. or without a job)

Instructions:
1. Generate 5 unique conversation partners using this template.
2. Ensure a diverse mix of ages, countries, languages, and religions.
3. For "Other languages," include 1-2 languages different from the native language.
4. Age should be more likely to fall between 20 and 50, but can range from 10 to 100.
5. Base mood should vary across the spectrum from 1 to 100.
6. invent facial assets for each character, including hair, eyes, nose, mouth, and any accessories.
7. Describe the personality of each character in a few sentences.
8. Create JSON objects for each character with the provided information.
9. Put all JSON objects in an array and export it as the default export.

Example:
{
  name: 'Juan Rodriguez',
  age: 19,
  voice: '94zOad0g7T7K4oa7zhDq',
  originCountry: 'MX',
  nativeLanguage: 'es-MX',
  otherLanguages: [
    {
      language: 'English',
      proficiencyLevel: 'B1'
    }
  ],
  facialAssets: {
    hair: 'Short, spiky black hair',
    eyes: 'Dark brown, expressive eyes',
    nose: 'Broad, prominent nose',
    mouth: 'Full, warm smile',
    accessories: 'Small silver hoop earring'
  },
  personality:
    'Juan is a passionate and optimistic young man. He is always eager to learn new things and try new experiences. He is a loyal friend and has a strong sense of family.',
  professionalOccupation: 'Student',
  greeting: 'Hola, ¿con quien hablo?'
}