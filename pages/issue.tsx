import Head from 'next/head'
import type { FC } from 'react'
import Button from '../components/Button'

const Issue: FC = () => {
  console.log('Hello, World!')

  return (
    <>
      <Head>
        <title>Zgłaszanie błędów</title>
      </Head>

      <h3 className="dark:text-gray-50">Zgłoś błąd, poprawkę lub sugestię</h3>

      <input
        placeholder="Dane konktaktowe (opcjonalnie)"
        className="pretty-input"
        type="text"
      />

      <textarea className="pretty-input" rows={10} placeholder="Informacje" />

      <Button>Zgłoś</Button>
    </>
  )
}

export default Issue
