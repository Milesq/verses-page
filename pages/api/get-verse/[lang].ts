import type { NowRequest, NowResponse } from '@vercel/node'
import axios from 'axios'
import DomParser from 'dom-parser'
import books from '../../../scripts/books.json'
import { Books } from '../../../scripts/Books'

const parser = new DomParser()

function extractText(node) {
  return node.childNodes[0].childNodes
    .map(e => e.outerHTML)
    .filter(e => !e.startsWith('<'))
    .join('')
}

async function getVerse(p) {
  const [name, chapter, paragraph] = p.replace(' ', ':', 1).split(':')

  let { data } = await axios.get([API, name, chapter].join('/'))

  const document = parser.parseFromString(data)
  data = document.getElementById('bibleText')

  data = data
    .getElementsByClassName('verse')
    .find(el => el.attributes[1].value.endsWith(paragraph))

  return extractText(data)
}

export default async (req: NowRequest, res: NowResponse): Promise<any> => {
  const { lang } = req.query
  const current: Books | undefined = books[lang as string]

  if (!current) {
    return res.status(404).json({ error: 'Unknown language' })
  }

  return res.json({ data: current.api })
}
