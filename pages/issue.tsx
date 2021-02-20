import Head from 'next/head'
import type { FC } from 'react'
import { useForm } from 'react-hook-form'
import Button from '../components/Button'

interface Inputs {
  contact?: string
  content: string
}

type CautionResponse = Partial<{
  ok: boolean
  error: string
}>

const Issue: FC = () => {
  const { register, handleSubmit, errors, reset } = useForm<Inputs>()

  const sendCaution: (data: Inputs) => Promise<void> = async data => {
    const resp: CautionResponse = await fetch('/api/caution/create', {
      method: 'POST',
      body: JSON.stringify(data),
    }).then(res => res.json())

    if (!resp.ok) {
      // eslint-disable-next-line no-alert
      alert(
        `Wysłanie twojej wskazówki nie powiodło się z powodu: ${resp.error}`
      )
    } else {
      reset()
      // eslint-disable-next-line no-alert
      alert('Pomyślnie wysłano wskazówkę. Dziękuję :-)')
    }
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
          autoComplete="off"
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
