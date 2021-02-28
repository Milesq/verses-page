import type { NowRequest, NowResponse } from '@vercel/node'
import axios from 'axios'
import DomParser, { Node } from 'dom-parser'
import {
  object,
  validate,
  string,
  tuple,
  ValidationError,
} from '@typeofweb/schema'
import books from '../../../scripts/books.json'
import { Books } from '../../../scripts/Books'
import makeError, { ErrorData } from '../../../errors'

const parser = new DomParser()

interface Verse {
  book: string
  chapter: string
  verses: [number, number]
}

const verseQueryValidator = validate(
  object({
    lang: string(),
    book: string(),
    chapter: string(),
    verses: tuple([string(), string()]),
  })
)

function extractText(node: Node) {
  return node.childNodes[0].childNodes
    .map(e => e.outerHTML)
    .filter(e => !e.startsWith('<'))
    .join('')
}

async function getVerses(endpoint: string, { book, chapter, verses }: Verse) {
  const { data: resp } = await axios.get(
    [endpoint, encodeURIComponent(book), chapter].join('/')
  )

  const document = parser.parseFromString(resp)
  const versesElement = document
    .getElementById('bibleText')
    .getElementsByClassName('verse')

  let verseText = ''

  const getOneVerse = (verse: any): string => {
    const node = versesElement.find(el =>
      (el.attributes[1] as any).value.endsWith(verse)
    )

    return extractText(node)
  }

  // eslint-disable-next-line no-plusplus
  for (let i = verses[0]; i <= verses[1]; i++) {
    verseText += getOneVerse(i)
  }

  return verseText.trim()
}

async function createBoard(title: string, verse: string): Promise<Buffer> {
  const apiUrl = new URL(process.env.IMAGE_API)

  apiUrl.searchParams.append('title', title)
  apiUrl.searchParams.append('verse', verse)

  const resp = await fetch(apiUrl.href)

  return Buffer.from(await resp.arrayBuffer())
}

export default async (req: NowRequest, res: NowResponse): Promise<any> => {
  const err = (error: ErrorData, code: number = 400) =>
    res.status(code).json(error)

  try {
    const { lang, book, chapter, verses } = verseQueryValidator(req.query)
    const [begVerse, endVerse] = verses.map(el => parseInt(el, 10))
    if (begVerse > endVerse) {
      return err(makeError('secondGreaterThanFirst'))
    }

    if (endVerse - begVerse > 4) {
      return err(makeError('tooManyVerses'))
    }

    const current: Books | undefined = books[lang]

    const found = current.data.find(({ path }) => path === book)

    if (found === undefined) {
      return err(makeError('unknownBook'))
    }

    try {
      const verseText = await getVerses(current.api, {
        book,
        chapter,
        verses: [begVerse, endVerse],
      })

      const image = await createBoard(
        `${found.name} ${chapter}:${begVerse}${
          endVerse !== begVerse ? `-${endVerse}` : ''
        }`,
        verseText
      )

      return res.send(image)
    } catch {
      return err(makeError('unknownVerseOrChapter'))
    }
  } catch (error) {
    if (error instanceof ValidationError) {
      return err(makeError('unkown', 'en', JSON.stringify(error.details)))
    }

    console.warn(error)
    return err(makeError('unkown', 'en', 'Unknown error'), 500)
  }
}
