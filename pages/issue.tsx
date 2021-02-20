import Head from 'next/head'
import type { FC } from 'react'
import { useForm } from 'react-hook-form'
import Button from '../components/Button'

interface Inputs {
  contact?: string
  content: string
}

const Issue: FC = () => {
  const { register, handleSubmit, errors } = useForm<Inputs>()

  function sendCaution(data: Inputs) {
    console.log(data)
  }

  return (
    <>
      <Head>
        <title>Zgłaszanie błędów</title>
      </Head>

      <h3 className="dark:text-gray-50">Zgłoś błąd, poprawkę lub sugestię</h3>

      {errors.contact && (
        <div className="text-red-500">
          Jeśli chcesz podać dane kontaktowe, niech będą poprawne
        </div>
      )}

      <form onSubmit={handleSubmit(sendCaution)}>
        <input
          name="contact"
          ref={register({ minLength: 5 })}
          placeholder="Dane konktaktowe (opcjonalnie)"
          className="pretty-input"
          type="text"
        />

        {errors.content && (
          <div className="text-red-500">Wpisz uwagę zanim ją wyślesz</div>
        )}

        <textarea
          name="content"
          ref={register({ required: true, minLength: 3 })}
          className="pretty-input"
          rows={10}
          placeholder="Informacje"
        />

        <Button>Zgłoś</Button>
      </form>
    </>
  )
}

export default Issue
