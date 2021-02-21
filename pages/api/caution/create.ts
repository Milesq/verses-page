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
    const error = `You can report only 10 cautions in ${ms(perMs, {
      long: true,
    })}`

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
    const error = 'You must send valid json'
    return res.status(400).json({ error })
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
    let why: string

    if (err instanceof ValidationError) why = err.message
    else {
      why = 'database error'
      console.warn(err)
    }

    return res.status(200).send({ error: why })
  }

  return res.status(200).json({ ok: true })
}
