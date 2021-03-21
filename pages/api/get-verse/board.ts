import type { VercelRequest, VercelResponse } from '@vercel/node'
import { object, optional, string, validate } from '@typeofweb/schema'

function createBoard(
  title: string,
  verse: string,
  quality: string = 'hd'
): Promise<Buffer> {
  const apiUrl = new URL(process.env.IMAGE_API)

  apiUrl.searchParams.append('title', title)
  apiUrl.searchParams.append('verse', verse)
  apiUrl.searchParams.append('quality', quality)

  return fetch(apiUrl.href)
    .then(resp => resp.arrayBuffer())
    .then(Buffer.from)
}

export default async (
  req: VercelRequest,
  res: VercelResponse
): Promise<any> => {
  const verseQueryValidator = validate(
    object({
      verse: string(),
      sign: string(),
      quality: optional(string()),
    })
  )

  try {
    const { sign, verse, quality } = verseQueryValidator(req.query)
    const image = await createBoard(sign, `“${verse}”`, quality)

    res.setHeader('X-Filename', encodeURIComponent(`${sign}.png`))
    return res.send(image)
  } catch (err) {
    console.log(err)
    return res.send({ error: 'Something went wrong' })
  }
}
