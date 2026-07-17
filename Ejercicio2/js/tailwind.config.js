tailwind.config = {
    theme: {
      extend: {
        colors: {
          brand: {
            50:  '#F2F6ED',
            100: '#E1EAD6',
            200: '#C4D6AE',
            300: '#9FBd80',
            400: '#77995A',
            500: '#4C6E3B',
            600: '#3A552D',
            700: '#2E4423',
            800: '#22331A',
            900: '#16241C'
          },
          clay: {
            50:  '#FBF1E7',
            100: '#F4DBC0',
            200: '#E7B78A',
            300: '#D4935E',
            400: '#BE7940',
            500: '#A45C2E',
            600: '#824825',
            700: '#63371C',
            800: '#442612',
            900: '#2A170A'
          },
          gold: {
            300: '#EACB86',
            400: '#D9A441',
            500: '#B8862F'
          },
          paper: {
            50: '#FBFAF6',
            100: '#F4F2EA',
            200: '#EAE7DA'
          }
        },
        fontFamily: {
          display: ['Fraunces', 'serif'],
          body: ['Inter', 'sans-serif'],
          tag: ['"Space Mono"', 'monospace']
        },
        spacing: {
          '18': '4.5rem',
          '22': '5.5rem',
          '30': '7.5rem'
        },
        screens: {
          'xs': '440px'
        },
        borderRadius: {
          'tag': '2px'
        },
        keyframes: {
          fadeUp: { '0%': { opacity: 0, transform: 'translateY(10px)' }, '100%': { opacity: 1, transform: 'translateY(0)' } },
          stampIn: { '0%': { opacity: 0, transform: 'rotate(-18deg) scale(0.6)' }, '100%': { opacity: 1, transform: 'rotate(-8deg) scale(1)' } },
          slideIn: { '0%': { transform: 'translateX(100%)' }, '100%': { transform: 'translateX(0)' } }
        },
        animation: {
          fadeUp: 'fadeUp .5s ease-out both',
          stampIn: 'stampIn .4s cubic-bezier(.34,1.56,.64,1) both',
          slideIn: 'slideIn .3s ease-out both'
        }
      }
    }
  }
