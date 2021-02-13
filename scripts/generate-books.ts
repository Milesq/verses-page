/* eslint-disable */
import { mkdirSync, existsSync, writeFileSync } from 'fs'
import * as puppeteer from 'puppeteer'
import config from './config'
import { bookNormalize } from './utils'

interface BookData {
  name: string
  path: string
}

async function goToBible(page: puppeteer.Page): Promise<void> {
  await page.click(config.SELECTOR.READ_BIBLE)
  await page.waitForNavigation()
}

async function getBooks(lang: string): Promise<BookData[]> {
  const browser = await puppeteer.launch({
    headless: false,
  })

  const page = await browser.newPage()
  await page.goto(new URL(config.API) + lang)
  await goToBible(page)

  const booksContainer = await page.$('.booksContainer')
  const booksElements = await booksContainer.$$('.bibleBook')
  const names = await Promise.all(booksElements.map(container =>
    container.$('.fullName').then(el => el.evaluate(el => el.textContent))
  ))

  await browser.close()
  return names.map(book => ({
    name: book,
    path: bookNormalize(book)
  }))
}

const language = process.argv[2] || 'en'

getBooks(language).then(names => {
  const { DATA_DIR } = config
  const json = JSON.stringify(names, null, 2)

  if (!existsSync(DATA_DIR)) {
    mkdirSync(DATA_DIR)
  }

  writeFileSync(`${DATA_DIR}/${language}.json`, json)
})
