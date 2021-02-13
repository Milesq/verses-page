/* eslint-disable import/prefer-default-export */
/// <reference lib="esnext" />

function replaceAll(str: string, search: string, newStr: string) {
  return str.replace(new RegExp(search, 'g'), newStr)
}

export function bookNormalize(name: string): string {
  return replaceAll(name.toLocaleLowerCase(), ' ', '-')
}
