export const TextVariants = {
  Branding: {
    Logo: 'Branding.Logo',
  },
  Forms: {
    GroupTitle: 'Forms.GroupTitle',
  },
}

export const textStyles = {
  components: {
    Text: {
      variants: {
        [TextVariants.Branding.Logo]: ({ colorMode }: { colorMode: string }) => ({
          fontSize: '1rem',
          fontWeight: '800',
          color: colorMode === 'light' ? 'gray.700' : 'gray.200',
        }),
        [TextVariants.Forms.GroupTitle]: {
          fontSize: '1.0rem',
          fontWeight: '600',
          color: 'gray.600',
        },
      },
    },
  },
}
