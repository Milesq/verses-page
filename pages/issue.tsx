import Head from 'next/head'
import { FC, useState } from 'react'
import { useForm } from 'react-hook-form'
import Swal from 'sweetalert2'
import { LinearProgress } from '@rmwc/linear-progress'
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
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Inputs>()
  const [isFormInProgress, lockForm] = useState(false)

  const sendCaution: (data: Inputs) => Promise<void> = async data => {
    if (isFormInProgress) {
      return
    }

    lockForm(true)

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

    lockForm(false)
  }

  return (
    <>
      {isFormInProgress && (
        <div className="w-full fixed top-0 left-0 z-50">
          <LinearProgress className="w-full" />
        </div>
      )}

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
          {...register('contact', { minLength: 5 })}
          placeholder="Dane konktaktowe (opcjonalnie)"
          className="pretty-input"
          type="text"
        />

        {errors.content && (
          <div className="text-red-500">Wpisz uwagę zanim ją wyślesz</div>
        )}

        <textarea
          {...register('content', { required: true, minLength: 3 })}
          autoComplete="off"
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
