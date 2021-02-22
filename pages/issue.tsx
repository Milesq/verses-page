import Head from 'next/head'
import { FC, useRef } from 'react'
import { useForm } from 'react-hook-form'
import Swal from 'sweetalert2'
import Button from '../components/Button'
import { Keys as ErrorKeys, stringifyError } from '../errors'

interface Inputs {
  contact?: string
  content: string
}

type CautionResponse = Partial<{
  ok: boolean
  error: string
  code: ErrorKeys
}>

const Issue: FC = () => {
  const { register, handleSubmit, errors, reset } = useForm<Inputs>()
  const formInProgress = useRef(false)

  const sendCaution: (data: Inputs) => Promise<void> = async data => {
    if (formInProgress.current) {
      return
    }

    formInProgress.current = true

    const resp: CautionResponse = await fetch('/api/caution/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(res => res.json())

    if (!resp.ok) {
      const error = stringifyError(resp.code)
      Swal.fire('Wysłanie twojej wskazówki nie powiodło się', error, 'error')
    } else {
      reset()
      Swal.fire(
        'Pomyślnie wysłano wskazówkę',
        'Dzięki za feedback :-)',
        'success'
      )
    }

    formInProgress.current = false
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
