export type Languages = 'pl' | 'en'

export type Message = string | ((...args: any) => string)

export interface ErrorsData {
  code: number
  message: Record<Languages, Message>
}

export type Errors =
  | 'unkown'
  | 'quoteExceeded'
  | 'invalidBody'
  | 'DBError'
  | 'secondGreaterThanFirst'
  | 'tooManyVerses'
  | 'unknownBook'
  | 'unknownVerseOrChapter'

export const errors: Record<Errors, ErrorsData> = {
  unkown: {
    code: -1,
    message: {
      en: arg => arg,
      pl: arg => arg,
    },
  },
  quoteExceeded: {
    code: 0,
    message: {
      en: (times, per) => `You can report only ${times} cautions in ${per}`,
      pl: `Wysłałeś maksymalną liczbę uwag, poczekaj chwilę zanim wyślesz kolejne`,
    },
  },
  invalidBody: {
    code: 1,
    message: {
      en: 'You must send valid body',
      pl: '',
    },
  },
  DBError: {
    code: 2,
    message: {
      en: 'database error',
      pl: 'Problem z bazą danych',
    },
  },
  secondGreaterThanFirst: {
    code: 3,
    message: {
      en: 'second verse cannot be lower than beging verse',
      pl: 'Początkowy werset musi być mniejszy niż drugi',
    },
  },
  tooManyVerses: {
    code: 4,
    message: {
      en: 'you can generate maximum 4 verses at one time',
      pl: 'Możesz wygenerować maksymalnie 4 wersety naraz',
    },
  },
  unknownBook: {
    code: 5,
    message: {
      en: 'unknown book',
      pl:
        'Nieznana księga, skontaktuj się z administratorem (poprzez zakładkę "zgłoś problem")',
    },
  },
  unknownVerseOrChapter: {
    code: 6,
    message: {
      en: 'cannot find specified verse',
      pl: 'Podany werset nie istnieje',
    },
  },
}

export type Keys = keyof typeof errors

export interface ErrorData {
  code: number
  error: string
}

export default (
  name: Keys,
  lang: Languages = 'en',
  ...args: any
): ErrorData => {
  const { code, message } = errors[name]
  const messageGetter = message[lang]

  const error =
    typeof messageGetter === 'function' ? messageGetter(...args) : messageGetter

  return {
    code,
    error,
  }
}
