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

const parser = new DomParser()

interface Verse {
  book: string
  chapter: string
  verses: [string, string]
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

async function getVerse(endpoint: string, { book, chapter, verses }: Verse) {
  const { data: resp } = await axios.get([endpoint, book, chapter].join('/'))

  const document = parser.parseFromString(resp)
  const bibleText = document.getElementById('bibleText')

  const data = bibleText
    .getElementsByClassName('verse')
    .find(el => (el.attributes[1] as any).value.endsWith(verses[0]))

  return extractText(data)
}

export default async (req: NowRequest, res: NowResponse): Promise<any> => {
  try {
    const { lang, book, chapter, verses } = verseQueryValidator(req.query)

    const current: Books | undefined = books[lang]

    const found = current.data.find(({ path }) => path === book)

    if (found === undefined) {
      return res.status(400).json({ error: 'Unknown book' })
    }

    const verseText = await getVerse(current.api, {
      book,
      chapter,
      verses: verses as [string, string],
    })

    return res.json({ data: verseText })
  } catch (err) {
    if (err instanceof ValidationError) {
      return res.status(400).json({ error: err.details })
    }

    console.log(err)
    return res.status(500).json({ error: 'Unknown error' })
  }
}
