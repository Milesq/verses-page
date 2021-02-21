import { writeFileSync } from 'fs'
import * as puppeteer from 'puppeteer'
import config from './config'
import { bookNormalize } from './utils'
import BookData from './BookData'

async function goToBible(page: puppeteer.Page): Promise<void> {
  await page.click(config.SELECTOR.READ_BIBLE)
  await page.waitForNavigation()
}

interface Books {
  api: string
  data: BookData[]
}

async function getBooks(lang: string): Promise<Books> {
  const browser = await puppeteer.launch({
    headless: false,
  })

  const page = await browser.newPage()
  await page.goto(new URL(config.API) + lang)
  await goToBible(page)
  const api = page.url()

  const booksContainer = await page.$('.booksContainer')
  const booksElements = await booksContainer.$$('.bibleBook')
  const names: string[] = await Promise.all(
    booksElements.map(container =>
      container
        .$('.fullName')
        .then(nameContainer => nameContainer.evaluate(el => el.textContent))
    )
  )

  await browser.close()
  const data = names.map(book => ({
    name: book,
    path: bookNormalize(book),
  }))

  return {
    data,
    api,
  }
}

const language = process.argv[2] || 'en'

getBooks(language).then(async ({ data: names, api }) => {
  const languages = await import(config.DATA_FILE).catch(() => ({}))
  languages[language] = {}
  languages[language].data = names
  languages[language].api = api

  const json = JSON.stringify(languages, null, 2)

  writeFileSync(config.DATA_FILE, json)
})
