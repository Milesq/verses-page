/* eslint-disable consistent-return */
import type { NowRequest, NowResponse } from '@vercel/node'
import { PrismaClient } from '@prisma/client'
import { serialize } from 'cookie'
import ms from 'ms'
import {
  optional,
  string,
  object,
  validate,
  ValidationError,
} from '@typeofweb/schema'
import errors, { ErrorData } from '../../../errors'

interface RateLimitOptions {
  times: number
  per: string
}

function rateLimit(
  req: NowRequest,
  res: NowResponse,
  { times, per }: RateLimitOptions
) {
  const perMs = ms(per)
  let sentCautions = parseInt(req.cookies.sentCautions, 10) || 0
  sentCautions += 1

  if (sentCautions > times) {
    const error = errors(
      'quoteExceeded',
      'en',
      10,
      ms(perMs, {
        long: true,
      })
    )

    res.status(429).json({ error })
    return false
  }

  const expires = new Date(new Date().getTime() + perMs)
  const sentCautionsCookie = serialize(
    'sentCautions',
    sentCautions.toString(),
    {
      httpOnly: true,
      expires,
      path: '/',
    }
  )

  res.setHeader('Set-Cookie', sentCautionsCookie)
  return true
}

const payloadSchema = object({
  contact: optional(string()),
  content: string(),
})

const validator = validate(payloadSchema)

export default async (req: NowRequest, res: NowResponse) => {
  if (typeof req.body !== 'object') {
    const error = errors('invalidBody')
    return res.status(400).json(error)
  }

  const inQuote = rateLimit(req, res, {
    times: 10,
    per: '30m',
  })

  if (!inQuote) {
    return
  }

  try {
    const { contact, content } = validator(req.body)
    const prisma = new PrismaClient()

    await prisma.caution.create({
      data: {
        contact,
        content,
      },
    })

    await prisma.$disconnect()
  } catch (err) {
    let error: ErrorData
    let code: number

    if (err instanceof ValidationError) {
      error = errors('unkown', 'en', err.message)
      code = 400
    } else {
      error = errors('DBError')
      code = 500
      console.warn(err)
    }

    return res.status(code).send(error)
  }

  return res.status(200).json({ ok: true })
}
