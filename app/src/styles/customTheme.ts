import { theme, extendTheme } from '@chakra-ui/react'

const customTheme = extendTheme({
  styles: {
    global: {
      'html, body': {
        textColor: 'white',
        color: 'indigo.600',
        bg: '',
        textRendering: 'geometricPrecision',
        fontSmooth: 'never',
      },
      '::-webkit-scrollbar:hover': {
        width: '16px',
      },
      '::-webkit-scrollbar': {
        width: '3px',
      },
      'div::-webkit-scrollbar-thumb': {
        backgroundColor: 'rgba(155, 155, 155, 0.5)',
        borderRadius: '10px',
        border: 'transparent',
      },
    },
  },
  fonts: {
    ...theme.fonts,
    heading: `'VP', ${theme.fonts.heading}`,
    body: `'VP', ${theme.fonts.body}`,
    mono: 'Menlo, monospace',
  },
  fontSizes: {
    xs: '0.75rem',
    sm: '0.875rem',
    md: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
    '5xl': '3rem',
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
    indigo: {
      100: 'rgb(62 46 108)',
      400: 'rgb(40 28 73)',
      600: 'rgb(22 17 45)',
      700: 'rgb(15 12 27)',
      800: 'rgb(11 9 21)',
    },
  },
  shadows: {
    ...theme.shadows,
    outline: "0 0 0 3px rgb(62 46 108)"
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
