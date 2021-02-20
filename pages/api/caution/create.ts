import type { NowRequest, NowResponse } from '@vercel/node'
import { PrismaClient } from '@prisma/client'
import {
  optional,
  string,
  object,
  validate,
  TypeOf,
  ValidationError,
} from '@typeofweb/schema'
import { parseJsonSafe } from '../../../utils'

const payloadSchema = object({
  contact: optional(string()),
  content: string(),
})

const validator = validate(payloadSchema)

export default async (req: NowRequest, res: NowResponse) => {
  const body = parseJsonSafe<TypeOf<typeof payloadSchema>>(req.body)
  if (body === null) {
    return res.status(400).send({ error: 'The body is not valid JSON' })
  }

  try {
    const { contact, content } = validator(body)
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
    else why = 'db error'

    return res.status(200).send({ error: why })
  }

  return res.status(200).json({ ok: true })
}
