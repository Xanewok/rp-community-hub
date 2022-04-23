import { theme, extendTheme } from '@chakra-ui/react'

const customTheme = extendTheme({
  fonts: {
    ...theme.fonts,
    heading: `'VP', ${theme.fonts.heading}`,
    body: `'VP', ${theme.fonts.body}`,
    mono: 'Menlo, monospace',
  },
  global: {
    'html, body': {
      lineHeight: 'tall',
      color: 'white',
      textColor: 'white',
    },
  },
  fontSizes: {
    xs: '1.25rem',
    sm: '1.375rem',
    md: '1.5rem',
    lg: '1.625rem',
    xl: '1.75rem',
    '2xl': '2rem',
    '3xl': '2.375rem',
    '4xl': '3.75rem',
    '5xl': '3.5rem',
    '6xl': '4.25rem',
    '7xl': '5rem',
    '8xl': '6.5rem',
    '9xl': '8.5rem',
  },
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1080px',
    xl: '1280px',
    '2xl': '1440px',
  },
  colors: {
    ...theme.colors,
    purple: {
      50: 'rgb(14, 7, 29)',
      100: '#181030',
      200: '#181030',
      300: '#352561',
      400: '#352561',
      500: '#372a70',
      600: '#372a70',
      700: '#7c41ea',
      800: '#B2A8F1',
      900: 'rgb(178, 168, 241)',
    },
  },
  components: {
    Heading: {
      sizes: {
        '4xl': {
          marginBottom: '1.5rem',
        },
        '2xl': {
          marginBottom: '1.5rem',
        },
        xl: {
          marginBottom: '1.5rem',
        },
        lg: {
          marginBottom: '1.5rem',
        },
        md: {
          marginBottom: '1rem',
        },
        sm: {
          marginBottom: '0.5rem',
        },
        xs: {
          marginBottom: '0.5rem',
        },
      },
    },
    Text: {
      baseStyle: {
        fontSize: 'md',
      },
    },
    Input: {
      variants: {
        filled: {
          _hover: {
            bg: 'rgb(49 54 176)',
          },
          color: 'rgb(49 54 176)',
          bg: 'rgb(49 54 176)',
        },
        outline: {
          color: 'rgb(49 54 176)',
          bg: 'rgb(49 54 176)',
        },
      },
    },
    Button: {
      sizes: {
        md: {
          fontSize: 'sm',
          px: '16px',
          pt: '1px',
          pb: '4px',
          h: '40px',
        },
      },
      variants: {
        solid: {
          textColor: 'white',
          bg: 'rgb(49 54 176)',
          boxShadow:
            '0 -2px 0 0 #474cc3, 0 2px 0 0 #22268e, -2px 0 0 0 #393eba, 2px 0 0 0 #393eba, 0 0 0 2px #0f0c1b, 0 -4px 0 0 #0f0c1b, 0 4px 0 0 #0f0c1b, -4px 0 0 0 #0f0c1b, 4px 0 0 0 #0f0c1b',
          borderRadius: '1px',
          _focus: {
            boxShadow:
              '0 -2px 0 0 #474cc3, 0 2px 0 0 #22268e, -2px 0 0 0 #393eba, 2px 0 0 0 #393eba, 0 0 0 2px #0f0c1b, 0 -4px 0 0 #0f0c1b, 0 4px 0 0 #0f0c1b, -4px 0 0 0 #0f0c1b, 4px 0 0 0 #0f0c1b',
          },
          _active: {
            bg: 'rgb(49 54 176)',
            boxShadow:
              '0 -2px 0 0 #474cc3, 0 2px 0 0 #22268e, -2px 0 0 0 #393eba, 2px 0 0 0 #393eba, 0 0 0 2px #0f0c1b, 0 -4px 0 0 #0f0c1b, 0 4px 0 0 #0f0c1b, -4px 0 0 0 #0f0c1b, 4px 0 0 0 #0f0c1b',
          },
          _hover: {
            bg: 'rgb(49 54 176)',
            filter: 'brightness(1.25)',
            _disabled: {
              bg: 'rgb(49 54 176)',
              filter: 'brightness(1)',
            },
          },
          _disabled: {
            opacity: 0.7,
            boxShadow:
              '0 -2px 0 0 #474cc3, 0 2px 0 0 #22268e, -2px 0 0 0 #393eba, 2px 0 0 0 #393eba, 0 0 0 2px #0f0c1b, 0 -4px 0 0 #0f0c1b, 0 4px 0 0 #0f0c1b, -4px 0 0 0 #0f0c1b, 4px 0 0 0 #0f0c1b',
          },
        },
      },
    },
  },
})

export default customTheme
