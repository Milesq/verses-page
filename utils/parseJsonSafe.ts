const parseJsonSafe = <T>(content: string): T | null => {
  try {
    return JSON.parse(content)
  } catch {
    return null
  }
}

export default parseJsonSafe
