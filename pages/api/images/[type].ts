import { object, string, validate, ValidationError } from '@typeofweb/schema'
import type { VercelRequest, VercelResponse } from '@vercel/node'
import makeError, { makeErrorSender } from '../../../errors'

const verseQueryValidator = validate(
  object({
    type: string(),
  })
)

export default async (
  req: VercelRequest,
  res: VercelResponse
): Promise<any> => {
  const err = makeErrorSender(res)

  try {
    const { type } = verseQueryValidator(req.query)

    const apiUrl = `${process.env.IMAGE_API}/template/${type}`

    const buf = await fetch(apiUrl)
      .then(r => r.arrayBuffer())
      .then(Buffer.from)

    return res.setHeader('content-type', 'image/png').send(buf)
  } catch (error) {
    if (error instanceof ValidationError) {
      return err(makeError('unkown', 'en', JSON.stringify(error.details)))
    }

    console.warn(error)
    return err(makeError('unkown', 'en', 'Unknown error'), 500)
  }
}
