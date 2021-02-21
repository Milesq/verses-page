export interface BookData {
  name: string
  path: string
}

export interface Books {
  api: string
  data: BookData[]
}
