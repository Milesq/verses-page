import express from 'express'
import getVerseApi from './app'

const app = express()

app.use(getVerseApi as any)

app.listen(3000, () => console.log('Server is listening'))
