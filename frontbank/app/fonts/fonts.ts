import localFont from 'next/font/local'

export const Tinkoff_Sans = localFont({
  src: [
    {
      path: './TinkoffSans-Regular.woff',
      weight: '400',
      style: 'normal',
    },
    {
      path: './TinkoffSans-Medium.woff',
      weight: '500',
      style: 'normal',
    },
    {
      path: './TinkoffSans-Bold.woff',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-tinkoff',
  display: 'swap',
})

export const Neue_Sans = localFont({
  src: [
    {
      path: './neue/NeueRegular.ttf',
      weight: '400',
      style: 'normal',
    },
  ],
  variable: '--font-neue',
  display: 'swap',
})