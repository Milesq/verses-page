import { resolve } from 'path'

export default {
  API: 'https://jw.org',
  SELECTOR: {
    READ_BIBLE:
      '#content > div.homeSectionContainer.homeWhatsNewGrid > div.homeWhatsNewItem.first.home-onlineBible.presentationIntent-excludeDefault > div > div.syn-body.sqr > h3 > a',
  },
  DATA_DIR: resolve(__dirname, '.books'),
}
