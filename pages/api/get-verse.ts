import axios from 'axios'
import DomParser from 'dom-parser'

const parser = new DomParser()

const API =
  'https://www.jw.org/pl/biblioteka/biblia/biblia-wydanie-do-studium/ksiegi'

function extractText(node) {
  return node.childNodes[0].childNodes
    .map(e => e.outerHTML)
    .filter(e => !e.startsWith('<'))
    .join('')
}

export default async p => {
  const [name, chapter, paragraph] = p.replace(' ', ':', 1).split(':')

  let { data } = await axios.get([API, name, chapter].join('/'))

  const document = parser.parseFromString(data)
  data = document.getElementById('bibleText')

  data = data
    .getElementsByClassName('verse')
    .find(el => el.attributes[1].value.endsWith(paragraph))

  return extractText(data)
}
