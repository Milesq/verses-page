export default function minimize(content: string): string {
  return content
    .split(/\s/)
    .filter(v => v)
    .join(' ')
}

function tag2str(content: TemplateStringsArray, ...args: any[]): string {
  return content.reduce((acc, el, i) => acc + el + (args[i] || ''), '')
}

export function tag(content: TemplateStringsArray, ...args: any[]): string {
  const str = tag2str(content, ...args)

  return minimize(str)
}
