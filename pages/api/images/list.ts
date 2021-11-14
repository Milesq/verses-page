import type { VercelRequest, VercelResponse } from '@vercel/node'
import makeError, { makeErrorSender } from '../../../errors'

export default async (
  req: VercelRequest,
  res: VercelResponse
): Promise<any> => {
  const err = makeErrorSender(res)

  try {
    const apiUrl = `${process.env.IMAGE_API}/templates`

    const list = await fetch(apiUrl).then(r => r.json())

    return res.json(list)
  } catch (error) {
    console.warn(error)
    return err(makeError('unkown', 'en', 'Unknown error'), 500)
  }
}
