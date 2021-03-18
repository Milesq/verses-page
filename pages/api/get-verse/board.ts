import type { VercelRequest, VercelResponse } from '@vercel/node'
import { object, string, validate } from '@typeofweb/schema'

async function createBoard(title: string, verse: string): Promise<Buffer> {
  const apiUrl = new URL(process.env.IMAGE_API)

  apiUrl.searchParams.append('title', title)
  apiUrl.searchParams.append('verse', verse)

  const resp = await fetch(apiUrl.href)

  return Buffer.from(await resp.arrayBuffer())
}

export default async (
  req: VercelRequest,
  res: VercelResponse
): Promise<any> => {
  const verseQueryValidator = validate(
    object({
      verse: string(),
      sign: string(),
    })
  )

  try {
    const { sign, verse } = verseQueryValidator(req.query)
    const image = await createBoard(sign, `“${verse}”`)

    res.setHeader('X-Filename', encodeURIComponent(`${verse}.png`))
    return res.send(image)
  } catch (err) {
    console.log(err)
    return res.send({ error: 'Something went wrong' })
  }
}
