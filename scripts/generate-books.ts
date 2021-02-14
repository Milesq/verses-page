/* eslint-disable */
import { writeFileSync } from 'fs'
import * as puppeteer from 'puppeteer'
import config from './config'
import { bookNormalize } from './utils'
import BookData from './BookData'

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

getBooks(language).then(async names => {
  const languages = await import(config.DATA_FILE).catch(() => ({}))
  languages[language] = names

  const json = JSON.stringify(languages, null, 2)

  writeFileSync(config.DATA_FILE, json)
})
