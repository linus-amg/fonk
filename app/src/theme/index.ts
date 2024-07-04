import { Theme, extendTheme } from '@chakra-ui/react'
import { theme as baseTheme } from '@saas-ui/theme-glass'
import { theme as proTheme } from '@saas-ui-pro/react'

import { textStyles } from './components/text'

const colors = {}

const overrides = {
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
  },
  colors: colors,
}

// @ts-expect-error - This is a custom theme
const customTheme: Theme = extendTheme(textStyles, overrides, proTheme, baseTheme)

export default customTheme
