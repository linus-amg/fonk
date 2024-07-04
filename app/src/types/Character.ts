export interface OtherLanguages {
  language: string
  proficiencyLevel: string
}

export interface FacialAssets {
  hair: string
  eyes: string
  nose: string
  mouth: string
  accessories: string
}

export interface Character {
  id: string
  name: string
  age: number
  originCountry: string
  nativeLanguage: string
  otherLanguages: OtherLanguages[]
  religion: string
  baseMood: number
  facialAssets: FacialAssets
  personality: string
  sexualOrientation: string
  professionalOccupation: string
  weight: number
  height: number
  photo: string
  greeting: string
  voice: string
}
