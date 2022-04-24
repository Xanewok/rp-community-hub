import { Global, css } from '@emotion/react'

const GlobalStyle: React.FC = (props) => (
  <>
    <Global
      styles={css`
        html {
          scoll-behavior: smooth;
          cursor: default;
        }
        body {
          background: url('/tilebg.png');
          background-repeat: no-repeat;
          background-size: cover;
          color: 'white';
          text-rendering: geometricPrecision;
          font-smooth: never;
        }
        #__next {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
        }
        button.chakra-accordion__button:focus {
          outline: none;
          box-shadow: none;
        }
        button.chakra-accordion__button:hover {
          background: initial;
        }
      `}
    />
    {props.children}
  </>
)

export default GlobalStyle
