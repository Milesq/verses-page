export type Errors =
  | 'unkown'
  | 'quoteExceeded'
  | 'invalidBody'
  | 'DBError'
  | 'secondGreaterThanFirst'
  | 'tooManyVerses'
  | 'unknownBook'
  | 'unknownVerseOrChapter'

export type Languages = 'pl' | 'en'

export type Message = string | ((...args: any) => string)

export interface ErrorsData {
  code: keyof Errors
  message: Record<Languages, Message>
}

export const errors: Record<Errors, Omit<ErrorsData, 'code'>> = {
  unkown: {
    message: {
      en: arg => arg,
      pl: arg => arg,
    },
  },
  quoteExceeded: {
    message: {
      en: (times, per) => `You can report only ${times} cautions in ${per}`,
      pl: `Wysłałeś maksymalną liczbę uwag, poczekaj chwilę zanim wyślesz kolejne`,
    },
  },
  invalidBody: {
    message: {
      en: 'You must send valid body',
      pl: '',
    },
  },
  DBError: {
    message: {
      en: 'database error',
      pl: 'Problem z bazą danych',
    },
  },
  secondGreaterThanFirst: {
    message: {
      en: 'second verse cannot be lower than beging verse',
      pl: 'Początkowy werset musi być mniejszy niż drugi',
    },
  },
  tooManyVerses: {
    message: {
      en: 'you can generate maximum 4 verses at one time',
      pl: 'Możesz wygenerować maksymalnie 4 wersety naraz',
    },
  },
  unknownBook: {
    message: {
      en: 'unknown book',
      pl:
        'Nieznana księga, skontaktuj się z administratorem (poprzez zakładkę "zgłoś problem")',
    },
  },
  unknownVerseOrChapter: {
    message: {
      en: 'cannot find specified verse',
      pl: 'Podany werset nie istnieje',
    },
  },
}

export type Keys = keyof typeof errors

export interface ErrorData {
  code: string
  error: string
}

export const stringifyError = (
  key: Keys,
  lang: Languages = 'pl',
  ...args: any
) => {
  const messageGetter = errors[key].message[lang]

  return typeof messageGetter === 'function'
    ? messageGetter(...args)
    : messageGetter
}

const makeError = (
  name: Keys,
  lang: Languages = 'en',
  ...args: any
): ErrorData => {
  const { message } = errors[name]
  const messageGetter = message[lang]

  const error =
    typeof messageGetter === 'function' ? messageGetter(...args) : messageGetter

  return {
    code: name,
    error,
  }
}

export default makeError
