const allBooks = require('./scripts/books.json')

module.exports = {
  i18n: {
    locales: Object.keys(allBooks),
    defaultLocale: 'pl',
  },
}
